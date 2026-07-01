import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getLocationScreens, getLocations, getLocationsWithScreens, updateLocationCoordinates } from "@/lib/api";
import type { Filters } from "@/lib/types";

export function useLocations(filters: Filters) {
  return useQuery({
    queryKey: ["locations", filters],
    queryFn: () => getLocations(filters),
  });
}

export function useLocationScreens(locationId?: string) {
  return useQuery({
    enabled: Boolean(locationId),
    queryKey: ["locationScreens", locationId],
    queryFn: () => {
      if (!locationId) {
        return Promise.resolve([]);
      }

      return getLocationScreens(locationId);
    },
  });
}

export function useLocationsWithScreens(filters: Filters) {
  return useQuery({
    queryKey: ["locationsWithScreens", filters],
    queryFn: () => getLocationsWithScreens(filters),
  });
}

export function useUpdateLocationCoordinates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationId: string) => updateLocationCoordinates(locationId),
    onSuccess: () => {
      // Lokasyon verilerini yeniden yükle
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locationsWithScreens"] });
    },
  });
}

/**
 * Uygulama başlangıcında konum iznini otomatik olarak isteyen hook
 * @param requestOnMount - true ise mount olduğunda otomatik izin ister (varsayılan: true)
 * @returns {Object} permission durumu ve yeniden istek fonksiyonu
 */
export function useLocationPermission(requestOnMount: boolean = true) {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error("Konum izni hatası:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (requestOnMount) {
      // Mevcut izin durumunu kontrol et
      Location.getForegroundPermissionsAsync().then(({ status }) => {
        setPermissionStatus(status);

        // Eğer izin verilmemişse, kullanıcıya sor
        if (status !== Location.PermissionStatus.GRANTED) {
          requestPermission();
        }
      });
    }
  }, [requestOnMount]);

  return {
    permissionStatus,
    isGranted: permissionStatus === Location.PermissionStatus.GRANTED,
    isDenied: permissionStatus === Location.PermissionStatus.DENIED,
    isLoading,
    requestPermission,
  };
}
