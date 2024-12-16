import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../components/Header';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'help.faq.howToPark.question',
    answer: 'help.faq.howToPark.answer',
  },
  {
    question: 'help.faq.payment.question',
    answer: 'help.faq.payment.answer',
  },
  {
    question: 'help.faq.cancel.question',
    answer: 'help.faq.cancel.answer',
  },
  {
    question: 'help.faq.refund.question',
    answer: 'help.faq.refund.answer',
  },
];

const SUPPORT_PHONE = '+90 850 123 4567';
const SUPPORT_WHATSAPP = '+90 850 123 4567';
const SUPPORT_EMAIL = 'support@parket.com';

export default function HelpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${SUPPORT_WHATSAPP.replace(/\s+/g, '')}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  const handleLiveChat = () => {
    router.push('/help/chat');
  };

  const renderFAQItem = (item: FAQItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.faqItem}
      onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{t(item.question)}</Text>
        <Ionicons 
          name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </View>
      {expandedFaq === index && (
        <Text style={styles.faqAnswer}>{t(item.answer)}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{t("help.title")}</Text>

        <View style={styles.supportOptions}>
          <TouchableOpacity style={styles.supportCard} onPress={handleLiveChat}>
            <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="chatbubbles" size={24} color="#1C0CCE" />
            </View>
            <Text style={styles.supportTitle}>{t('help.liveChat')}</Text>
            <Text style={styles.supportDesc}>{t('help.liveChatDesc')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={handleWhatsApp}>
            <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <Text style={styles.supportTitle}>{t('help.whatsapp')}</Text>
            <Text style={styles.supportDesc}>{t('help.whatsappDesc')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={handleCall}>
            <View style={[styles.iconContainer, { backgroundColor: '#fce4ec' }]}>
              <Ionicons name="call" size={24} color="#e91e63" />
            </View>
            <Text style={styles.supportTitle}>{t('help.phone')}</Text>
            <Text style={styles.supportDesc}>{SUPPORT_PHONE}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={handleEmail}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name="mail" size={24} color="#ff9800" />
            </View>
            <Text style={styles.supportTitle}>{t('help.email')}</Text>
            <Text style={styles.supportDesc}>{SUPPORT_EMAIL}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('help.faqTitle')}</Text>
        <View style={styles.faqContainer}>
          {FAQS.map(renderFAQItem)}
        </View>
      </ScrollView>
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
    padding: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 32,
    marginBottom: 16,
  },
  supportOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  supportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  supportDesc: {
    fontSize: 14,
    color: '#666',
  },
  faqContainer: {
    marginTop: 8,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
}); 