import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import { apiServices } from "@/lib/api-services";

export default function CampaignDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiServices.getCampaignById(Number(id));
      setCampaign(data);
    } catch (err) {
      setError(t("campaigns.error"));
      console.error("Failed to load campaign:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#1C0CCE", "#1d3461"]}
          style={StyleSheet.absoluteFill}
        />
        <Header showBackButton={true} />
        <View style={[styles.content, styles.centerContainer]}>
          <ActivityIndicator size="large" color="#1C0CCE" />
        </View>
      </View>
    );
  }

  if (error || !campaign) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#1C0CCE", "#1d3461"]}
          style={StyleSheet.absoluteFill}
        />
        <Header showBackButton={true} />
        <View style={[styles.content, styles.centerContainer]}>
          <Text style={styles.errorText}>{error || t("campaigns.notFound")}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${campaign.color}15` }]}>
          <Ionicons name={campaign.icon as any} size={32} color={campaign.color} />
        </View>
        
        <Text style={styles.title}>{campaign.title}</Text>
        
        <View style={styles.validUntil}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.validUntilText}>
            {t("campaigns.validUntil")}: {campaign.validUntil}
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.description}>{campaign.description}</Text>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsTitle}>{t("campaigns.terms")}</Text>
            <Text style={styles.termsText}>{campaign.terms || t("campaigns.termsDescription")}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  validUntil: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  validUntilText: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  termsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
}); 