import { Text, View } from "react-native";

import { useTheme } from "@/lib/theme";
import type { Screen } from "@/lib/types";
import { formatDimensions, formatLoopCopy, formatTimeRange } from "@/lib/utils";

export function ScreenDetailPanel({ screen }: { screen: Screen }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.backgroundRaised,
        borderRadius: 18,
        padding: 18,
        gap: 12,
      }}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Seçili Ekran</Text>
        <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "700" }}>{screen.name}</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
          {screen.format} • {screen.type} • {screen.orientation}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{formatDimensions(screen.widthCm, screen.heightCm)}</Text>
        {screen.resolution ? (
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{screen.resolution}</Text>
        ) : null}
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{formatLoopCopy(screen)}</Text>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>Yayın Akışı</Text>
        {screen.currentCampaign ? (
          <View style={{ gap: 2 }}>
            <Text style={{ color: colors.textPrimary }}>
              Şu an: {screen.currentCampaign.brand} ({formatTimeRange(screen.currentCampaign.startTime, screen.currentCampaign.endTime)})
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Süre: {screen.currentCampaign.durationSec} saniye
            </Text>
          </View>
        ) : (
          <Text style={{ color: colors.textSecondary }}>Şu anda yayın yok.</Text>
        )}
        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Sıradaki Yayınlar</Text>
          {screen.upcomingCampaigns?.length ? (
            screen.upcomingCampaigns.map((campaign) => (
              <View key={`${campaign.brand}-${campaign.startTime}`} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{campaign.brand}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                  {formatTimeRange(campaign.startTime, campaign.endTime)} • {campaign.durationSec}s
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Planlanmış yayın bulunmuyor.</Text>
          )}
        </View>
      </View>
    </View>
  );
}
