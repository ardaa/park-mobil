import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image, TextInput, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import { Announcement } from "@/types/announcement";
import { apiServices } from "@/lib/api-services";

type TabType = 'campaigns' | 'announcements';

export default function CampaignsScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [campaignCode, setCampaignCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'campaigns') {
        const data = await apiServices.getCampaigns();
        setCampaigns(data);
      } else {
        const data = await apiServices.getAnnouncements();
        setAnnouncements(data);
      }
    } catch (err) {
      setError(t(activeTab === 'campaigns' ? "campaigns.error" : "announcements.error"));
      console.error(`Failed to load ${activeTab}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignPress = (campaign: Campaign) => {
    router.push({
      pathname: '/campaign-details',
      params: campaign
    });
  };

  const handleAnnouncementPress = async (announcement: Announcement) => {
    if (!announcement.isRead) {
      try {
        await apiServices.markAnnouncementAsRead(announcement.id);
        setAnnouncements(prev => 
          prev.map(a => a.id === announcement.id ? { ...a, isRead: true } : a)
        );
      } catch (err) {
        console.error('Failed to mark announcement as read:', err);
      }
    }

    router.push({
      pathname: '/announcement-details',
      params: announcement
    });
  };

  const handleSubmitCode = async () => {
    if (!campaignCode.trim()) return;
    
    try {
      setSubmitting(true);
      // Here you would typically make an API call to validate and apply the campaign code
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Show success message or handle the response
      // For now, we'll just close the modal and reset the form
      setShowCodeModal(false);
      setCampaignCode('');
      
      // Refresh campaigns list to show newly added campaign
      await loadData();
    } catch (err) {
      console.error('Failed to submit campaign code:', err);
      // You might want to show an error message here
    } finally {
      setSubmitting(false);
    }
  };

  const renderAnnouncement = (announcement: Announcement) => (
    <Pressable
      key={announcement.id}
      style={[styles.announcementCard, !announcement.isRead && styles.unreadCard]}
      onPress={() => handleAnnouncementPress(announcement)}
    >
      <View style={styles.announcementIconContainer}>
        <Ionicons 
          name={
            announcement.type === 'maintenance' ? 'construct' :
            announcement.type === 'warning' ? 'warning' : 'information-circle'
          }
          size={24}
          color={
            announcement.type === 'maintenance' ? '#FF9500' :
            announcement.type === 'warning' ? '#FF3B30' : '#007AFF'
          }
        />
      </View>
      <View style={styles.announcementContent}>
        <Text style={styles.announcementTitle}>{announcement.title}</Text>
        <Text style={styles.announcementDescription} numberOfLines={2}>
          {announcement.description}
        </Text>
        <Text style={styles.announcementDate}>{announcement.date}</Text>
      </View>
      {!announcement.isRead && <View style={styles.unreadDot} />}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{t("campaigns.title")}</Text>
          {activeTab === 'campaigns' && (
            <Pressable 
              style={styles.codeButton}
              onPress={() => setShowCodeModal(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#1C0CCE" />
              <Text style={styles.codeButtonText}>{t("campaigns.addCode")}</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'campaigns' && styles.activeTab]}
            onPress={() => setActiveTab('campaigns')}
          >
            <Text style={[styles.tabText, activeTab === 'campaigns' && styles.activeTabText]}>
              {t("tabs.campaigns")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'announcements' && styles.activeTab]}
            onPress={() => setActiveTab('announcements')}
          >
            <Text style={[styles.tabText, activeTab === 'announcements' && styles.activeTabText]}>
              {t("tabs.announcements")}
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1C0CCE" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryText}>{t("common.retry")}</Text>
            </Pressable>
          </View>
        ) : activeTab === 'campaigns' ? (
          campaigns.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>{t("campaigns.noCampaigns")}</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {campaigns.map((campaign) => (
                <Pressable
                  key={campaign.id}
                  style={styles.campaignCard}
                  onPress={() => handleCampaignPress(campaign)}
                >
                  <Image 
                    source={{ uri: campaign.image }}
                    style={styles.campaignImage}
                    resizeMode="cover"
                  />
                  <View style={styles.campaignContent}>
                    <View style={styles.campaignInfo}>
                      <View style={styles.titleContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: `${campaign.color}15` }]}>
                          <Ionicons name={campaign.icon as any} size={24} color={campaign.color} />
                        </View>
                        <Text style={styles.campaignTitle}>{campaign.title}</Text>
                      </View>
                      <Text style={styles.campaignDescription} numberOfLines={2}>
                        {campaign.description}
                      </Text>
                      <View style={styles.validUntil}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.validUntilText}>
                          {t("campaigns.validUntil")}: {campaign.validUntil}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Ionicons name="chevron-forward" size={24} color="#1C0CCE" />
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )
        ) : (
          announcements.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>{t("announcements.noAnnouncements")}</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {announcements.map(renderAnnouncement)}
            </ScrollView>
          )
        )}

        {/* Add Campaign Code Modal */}
        <Modal
          visible={showCodeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCodeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("campaigns.enterCode")}</Text>
              <TextInput
                style={styles.codeInput}
                value={campaignCode}
                onChangeText={setCampaignCode}
                placeholder={t("campaigns.codePlaceholder")}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <View style={styles.modalButtons}>
                <Pressable 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowCodeModal(false)}
                >
                  <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitCode}
                  disabled={submitting || !campaignCode.trim()}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>{t("common.submit")}</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 16,
    marginTop: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 16,
  },
  campaignCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  campaignImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  campaignContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
  },
  campaignInfo: {
    flex: 1,
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  campaignDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  validUntil: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  validUntilText: {
    fontSize: 12,
    color: "#666",
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(28, 12, 206, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1C0CCE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 12, 206, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  codeButtonText: {
    color: '#1C0CCE',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
  },
  submitButton: {
    backgroundColor: '#1C0CCE',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F1F2F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#1C0CCE',
  },
  announcementCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  unreadCard: {
    backgroundColor: '#F8F9FA',
  },
  announcementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  announcementDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1C0CCE',
  },
}); 