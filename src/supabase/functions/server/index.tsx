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
    console.log('❌ No authorization token in request');
    return { user: null, error: 'No authorization token provided' };
  }
  
  console.log('🔐 Verifying user with token...');
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    console.log('❌ Token verification failed:', error.message);
    return { user: null, error: `Token verification failed: ${error.message}` };
  }
  
  if (!user) {
    console.log('❌ No user found for token');
    return { user: null, error: 'User not found' };
  }
  
  console.log('✅ User verified:', user.id);
  return { user, error: null };
}

// AUTHENTICATION ROUTES

// Sign up
app.post('/make-server-716cadf3/auth/signup', async (c) => {
  try {
    console.log('📝 Signup request received');
    const { email, password, fullName, businessName } = await c.req.json();
    console.log('📝 Signup data:', { email, fullName, businessName: businessName || '(not provided)' });
    
    if (!email || !password || !fullName) {
      console.log('❌ Validation failed: missing required fields');
      return c.json({ error: 'Email, password, and full name are required' }, 400);
    }
    
    console.log('🔐 Creating user with Supabase admin...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName, business_name: businessName || '' },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });
    
    if (error) {
      console.log(`❌ Supabase createUser error: ${error.message}`, error);
      // Provide more helpful error messages
      if (error.message.includes('already registered')) {
        return c.json({ error: 'This email is already registered. Please use a different email or try logging in.' }, 400);
      }
      return c.json({ error: error.message }, 400);
    }
    
    console.log(`✅ User created successfully: ${data.user?.id}`);
    console.log('🔐 Auto-signing in user...');
    
    // Auto sign in the user
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      console.log(`❌ Auto sign-in error: ${signInError.message}`, signInError);
      return c.json({ error: `Account created but sign-in failed: ${signInError.message}` }, 400);
    }
    
    console.log(`✅ Sign-in successful, returning session`);
    return c.json({ 
      user: data.user,
      session: sessionData.session
    });
  } catch (error) {
    console.log(`❌ Sign up error in main catch:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ error: `Failed to sign up: ${errorMessage}` }, 500);
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
    
    console.log(`📊 Fetching metrics for user: ${user.id}`);
    const metrics = await kv.getByPrefix(`metrics:${user.id}:`);
    console.log(`✅ Found ${metrics.length} metrics for user ${user.id}`);
    
    // getByPrefix already returns the values directly, no need to map
    return c.json({ metrics });
  } catch (error) {
    console.log(`❌ Error fetching metrics: ${error}`);
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
    
    // All fields are now optional - use defaults for missing values
    const metricId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const metric = {
      id: metricId,
      user_id: user.id,
      metric_name: metric_name || 'Untitled Metric',
      current_value: current_value !== undefined ? parseFloat(current_value) : 0,
      target_value: target_value !== undefined ? parseFloat(target_value) : 0,
      unit: unit || '',
      category: category || 'Sales',
      created_at: now,
      last_updated: now
    };
    
    console.log(`💾 Creating metric for user ${user.id}:`, metric.metric_name);
    await kv.set(`metrics:${user.id}:${metricId}`, metric);
    console.log(`✅ Metric created successfully with ID: ${metricId}`);
    
    return c.json({ metric });
  } catch (error) {
    console.log(`❌ Error creating metric: ${error}`);
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
    
    console.log(`🔄 Updating metric ${metricId} for user ${user.id}`);
    
    // Get existing metric to verify ownership
    const existingMetric = await kv.get(`metrics:${user.id}:${metricId}`);
    if (!existingMetric) {
      console.log(`❌ Metric ${metricId} not found for user ${user.id}`);
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
    console.log(`✅ Metric ${metricId} updated successfully`);
    
    return c.json({ metric: updatedMetric });
  } catch (error) {
    console.log(`❌ Error updating metric: ${error}`);
    return c.json({ error: 'Failed to update metric' }, 500);
  }
});

// Delete metric
app.delete('/make-server-716cadf3/metrics/:id', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      console.log(`❌ Delete unauthorized: ${authError}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const metricId = c.req.param('id');
    console.log(`🗑️ Attempting to delete metric ${metricId} for user ${user.id}`);
    
    // Verify metric exists and belongs to user
    const existingMetric = await kv.get(`metrics:${user.id}:${metricId}`);
    if (!existingMetric) {
      console.log(`❌ Metric ${metricId} not found for user ${user.id}`);
      return c.json({ error: 'Metric not found' }, 404);
    }
    
    console.log(`🔍 Found metric: ${existingMetric.metric_name}`);
    await kv.del(`metrics:${user.id}:${metricId}`);
    console.log(`✅ Metric ${metricId} deleted successfully`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`❌ Error deleting metric: ${error}`);
    return c.json({ error: 'Failed to delete metric' }, 500);
  }
});

Deno.serve(app.fetch);
