'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);
  const [projectInfo, setProjectInfo] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check if environment variables are set
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          setError('Missing Supabase environment variables. Please check your .env.local file.');
          setConnectionStatus('Failed');
          return;
        }

        if (supabaseUrl === 'your_supabase_project_url_here' || supabaseAnonKey === 'your_supabase_anon_key_here') {
          setError('Please update your .env.local file with actual Supabase credentials.');
          setConnectionStatus('Failed');
          return;
        }

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Test the connection by making a simple query
        const { data, error: queryError } = await supabase
          .from('_supabase_migrations')
          .select('*')
          .limit(1);

        if (queryError) {
          // This is expected for the migrations table, let's try a different approach
          // Test connection by getting project info
          const { data: projectData, error: projectError } = await supabase.auth.getSession();
          
          if (projectError) {
            setError(`Connection failed: ${projectError.message}`);
            setConnectionStatus('Failed');
          } else {
            setConnectionStatus('Connected successfully!');
            setProjectInfo({
              url: supabaseUrl,
              hasSession: !!projectData.session
            });
          }
        } else {
          setConnectionStatus('Connected successfully!');
          setProjectInfo({
            url: supabaseUrl,
            migrationsCount: data?.length || 0
          });
        }

      } catch (err) {
        setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setConnectionStatus('Failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Supabase Connection Test
          </h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Connection Status</h2>
              <div className={`mt-2 p-3 rounded-md ${
                connectionStatus === 'Connected successfully!' 
                  ? 'bg-green-50 text-green-800' 
                  : connectionStatus === 'Failed'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-yellow-50 text-yellow-800'
              }`}>
                {connectionStatus}
              </div>
            </div>

            {error && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">Error</h2>
                <div className="mt-2 p-3 bg-red-50 text-red-800 rounded-md">
                  {error}
                </div>
              </div>
            )}

            {projectInfo && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">Project Info</h2>
                <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-md">
                  <p><strong>URL:</strong> {projectInfo.url}</p>
                  {projectInfo.hasSession !== undefined && (
                    <p><strong>Session Available:</strong> {projectInfo.hasSession ? 'Yes' : 'No'}</p>
                  )}
                  {projectInfo.migrationsCount !== undefined && (
                    <p><strong>Migrations:</strong> {projectInfo.migrationsCount}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-medium text-gray-900">Environment Variables</h2>
              <div className="mt-2 p-3 bg-gray-50 text-gray-800 rounded-md text-sm">
                <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</p>
                <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
