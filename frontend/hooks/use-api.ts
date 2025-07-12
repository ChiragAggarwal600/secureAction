// Custom React hooks for API integration
import { useState, useEffect, useCallback } from 'react';
import { 
  SecurityService, 
  ThreatService, 
  FraudService, 
  BlockchainService, 
  BiometricService, 
  AlertService,
  SecurityOverview,
  ThreatEvent,
  FraudEvent,
  BlockchainTransaction,
  BiometricData,
  Alert,
  ThreatFilterParams,
  FraudFilterParams,
  AlertFilterParams,
  BlockchainFilterParams
} from '@/lib/api';

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Security Dashboard hook
export function useSecurityOverview() {
  return useApiCall(() => SecurityService.getOverview());
}

// Threat Intelligence hooks
export function useThreats(params?: ThreatFilterParams) {
  return useApiCall(() => ThreatService.getThreats(params), [JSON.stringify(params)]);
}

export function useThreat(id: string) {
  return useApiCall(() => ThreatService.getThreat(id), [id]);
}

// Fraud Detection hooks
export function useFraudEvents(params?: FraudFilterParams) {
  return useApiCall(() => FraudService.getFraudEvents(params), [JSON.stringify(params)]);
}

export function useFraudEvent(id: string) {
  return useApiCall(() => FraudService.getFraudEvent(id), [id]);
}

// Blockchain Security hooks
export function useBlockchainTransactions(params?: BlockchainFilterParams) {
  return useApiCall(() => BlockchainService.getTransactions(params), [JSON.stringify(params)]);
}

export function useBlockchainTransaction(id: string) {
  return useApiCall(() => BlockchainService.getTransaction(id), [id]);
}

// Biometric Authentication hooks
export function useBiometricData() {
  return useApiCall(() => BiometricService.getBiometricData());
}

export function useBiometricStats() {
  return useApiCall(() => BiometricService.getBiometricStats());
}

// Alerts hooks
export function useAlerts(params?: AlertFilterParams) {
  return useApiCall(() => AlertService.getAlerts(params), [JSON.stringify(params)]);
}

// Real-time data hook with WebSocket
export function useRealTimeData<T>(
  initialFetch: () => Promise<T>,
  websocketEventType: string,
  updateData?: (currentData: T | null, newData: any) => T
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial data fetch
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await initialFetch();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Subscribe to WebSocket updates
    const { websocketService } = require('@/lib/websocket-service');
    const unsubscribe = websocketService.subscribe(websocketEventType, (newData: any) => {
      if (updateData) {
        setData(currentData => updateData(currentData, newData));
      } else {
        // Default behavior: replace data
        setData(newData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [websocketEventType]);

  return { data, loading, error };
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const { AuthService } = require('@/lib/api');
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { AuthService } = require('@/lib/api');
    const result = await AuthService.login({ email, password });
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    const { AuthService } = require('@/lib/api');
    await AuthService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    const { AuthService } = require('@/lib/api');
    return AuthService.isAuthenticated();
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated()
  };
}
