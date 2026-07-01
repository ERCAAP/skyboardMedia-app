import { Tabs } from "expo-router";
import { useTheme } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";

const TAB_ICON: Record<string, keyof typeof Feather.glyphMap> = {
  map: "map",
  list: "list",
  profile: "user",
};

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 8,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ color, size }) => (
          <Feather name={TAB_ICON[route.name] ?? "circle"} color={color} size={size} />
        ),
      })}
    >
      <Tabs.Screen name="map" options={{ title: "Harita" }} />
      <Tabs.Screen name="list" options={{ title: "Liste" }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size, focused }) => (
            <Feather
              name="user"
              color={color}
              size={focused ? size + 2 : size}
              style={{
                shadowColor: focused ? colors.primary : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focused ? 0.3 : 0,
                shadowRadius: focused ? 2 : 0,
                elevation: focused ? 2 : 0,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
