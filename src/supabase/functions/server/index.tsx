import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No authorization token provided' };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { user: null, error: 'Unauthorized' };
  }
  
  return { user, error: null };
}

// AUTHENTICATION ROUTES

// Sign up
app.post('/make-server-716cadf3/auth/signup', async (c) => {
  try {
    const { email, password, fullName, businessName } = await c.req.json();
    
    if (!email || !password || !fullName) {
      return c.json({ error: 'Email, password, and full name are required' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName, business_name: businessName || '' },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });
    
    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Auto sign in the user
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      return c.json({ error: signInError.message }, 400);
    }
    
    return c.json({ 
      user: data.user,
      session: sessionData.session
    });
  } catch (error) {
    console.log(`Sign up error in main catch: ${error}`);
    return c.json({ error: 'Failed to sign up' }, 500);
  }
});

// METRICS ROUTES

// Get all metrics for user
app.get('/make-server-716cadf3/metrics', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userMetrics = await kv.getByPrefix(`metrics:${user.id}:`);
    const metrics = userMetrics.map(item => item.value);
    
    return c.json({ metrics });
  } catch (error) {
    console.log(`Error fetching metrics: ${error}`);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

// Create metric
app.post('/make-server-716cadf3/metrics', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { metric_name, current_value, target_value, unit, category } = await c.req.json();
    
    if (!metric_name || current_value === undefined || target_value === undefined || !unit || !category) {
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    const metricId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const metric = {
      id: metricId,
      user_id: user.id,
      metric_name,
      current_value: parseFloat(current_value),
      target_value: parseFloat(target_value),
      unit,
      category,
      created_at: now,
      last_updated: now
    };
    
    await kv.set(`metrics:${user.id}:${metricId}`, metric);
    
    return c.json({ metric });
  } catch (error) {
    console.log(`Error creating metric: ${error}`);
    return c.json({ error: 'Failed to create metric' }, 500);
  }
});

// Update metric
app.put('/make-server-716cadf3/metrics/:id', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const metricId = c.req.param('id');
    const { metric_name, current_value, target_value, unit, category } = await c.req.json();
    
    // Get existing metric to verify ownership
    const existingMetric = await kv.get(`metrics:${user.id}:${metricId}`);
    if (!existingMetric) {
      return c.json({ error: 'Metric not found' }, 404);
    }
    
    const now = new Date().toISOString();
    const updatedMetric = {
      ...existingMetric,
      metric_name,
      current_value: parseFloat(current_value),
      target_value: parseFloat(target_value),
      unit,
      category,
      last_updated: now
    };
    
    await kv.set(`metrics:${user.id}:${metricId}`, updatedMetric);
    
    return c.json({ metric: updatedMetric });
  } catch (error) {
    console.log(`Error updating metric: ${error}`);
    return c.json({ error: 'Failed to update metric' }, 500);
  }
});

// Delete metric
app.delete('/make-server-716cadf3/metrics/:id', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const metricId = c.req.param('id');
    
    // Verify metric exists and belongs to user
    const existingMetric = await kv.get(`metrics:${user.id}:${metricId}`);
    if (!existingMetric) {
      return c.json({ error: 'Metric not found' }, 404);
    }
    
    await kv.del(`metrics:${user.id}:${metricId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting metric: ${error}`);
    return c.json({ error: 'Failed to delete metric' }, 500);
  }
});

Deno.serve(app.fetch);
