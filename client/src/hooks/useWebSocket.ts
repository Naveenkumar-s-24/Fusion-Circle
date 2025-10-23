import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { queryClient } from '@/lib/queryClient';

export function useWebSocket() {
  const { user, isAuthenticated } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        // Authenticate WebSocket connection
        ws.send(JSON.stringify({ type: 'auth', userId: user.id }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // Handle real-time updates
          switch (message.type) {
            case 'auth_success':
              console.log('WebSocket authenticated');
              break;
              
            case 'project_created':
            case 'project_updated':
            case 'project_deleted':
              // Invalidate projects queries
              queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
              break;
              
            case 'task_created':
            case 'task_updated':
            case 'task_deleted':
              // Invalidate project and task queries
              queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
              if (message.data?.projectId) {
                queryClient.invalidateQueries({ 
                  queryKey: ['/api/projects', message.data.projectId] 
                });
              }
              break;
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isAuthenticated && user) {
            connect();
          }
        }, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, user]);

  return wsRef.current;
}
