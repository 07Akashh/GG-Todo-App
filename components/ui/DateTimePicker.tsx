import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DateTimePickerComponentProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export function DateTimePickerComponent({
  value,
  onChange,
  minimumDate,
}: DateTimePickerComponentProps) {
  const { colors, isDark } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  const handleDateSelect = (day: any) => {
    const newDate = new Date(day.dateString);
    setTempDate(newDate);
    setShowCalendar(false);
    
    // On iOS, show time picker immediately after date selection
    if (Platform.OS === 'ios') {
      setShowTimePicker(true);
    } else {
      // On Android, show time picker
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type === 'set' && selectedTime) {
        const combined = new Date(tempDate);
        combined.setHours(selectedTime.getHours());
        combined.setMinutes(selectedTime.getMinutes());
        setSelectedDate(combined);
        onChange(combined);
      }
    } else {
      if (selectedTime) {
        const combined = new Date(tempDate);
        combined.setHours(selectedTime.getHours());
        combined.setMinutes(selectedTime.getMinutes());
        setTempDate(combined);
      }
    }
  };

  const handleTimeConfirm = () => {
    setShowTimePicker(false);
    setSelectedDate(tempDate);
    onChange(tempDate);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const markedDates: any = {};
  if (selectedDate) {
    const dateStr = selectedDate.toISOString().split('T')[0];
    markedDates[dateStr] = {
      selected: true,
      selectedColor: colors.tint,
      selectedTextColor: isDark ? '#000' : '#fff',
    };
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor: isDark ? '#2F2F2F' : '#F5F5F5',
            borderColor: colors.tabIconDefault + '40',
          },
        ]}
        onPress={() => setShowCalendar(true)}>
        <ThemedText style={styles.dateButtonText}>
          {value ? formatDateTime(value) : 'Select date and time'}
        </ThemedText>
        <IconSymbol name="calendar" size={20} color={colors.tint} />
      </TouchableOpacity>

      {/* Calendar Modal */}
      {showCalendar && (
        <Modal visible={showCalendar} transparent animationType="slide" onRequestClose={() => setShowCalendar(false)}>
          <View style={styles.modalOverlay}>
            <ThemedView
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
                },
              ]}>
              <View style={styles.modalHeader}>
                <ThemedText type="title" style={styles.modalTitle}>
                  Select Date
                </ThemedText>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Calendar
                current={tempDate.toISOString().split('T')[0]}
                minDate={minimumDate?.toISOString().split('T')[0]}
                onDayPress={handleDateSelect}
                markedDates={markedDates}
                theme={{
                  backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
                  calendarBackground: isDark ? '#1F1F1F' : '#FFFFFF',
                  textSectionTitleColor: colors.text,
                  selectedDayBackgroundColor: colors.tint,
                  selectedDayTextColor: isDark ? '#000' : '#fff',
                  todayTextColor: colors.tint,
                  dayTextColor: colors.text,
                  textDisabledColor: colors.tabIconDefault + '60',
                  dotColor: colors.tint,
                  selectedDotColor: isDark ? '#000' : '#fff',
                  arrowColor: colors.tint,
                  monthTextColor: colors.text,
                  textDayFontWeight: '500',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '600',
                }}
                style={styles.calendar}
              />
            </ThemedView>
          </View>
        </Modal>
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal visible={showTimePicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <ThemedView
                  style={[
                    styles.timePickerModal,
                    {
                      backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
                    },
                  ]}>
                  <View style={styles.modalHeader}>
                    <ThemedText type="title" style={styles.modalTitle}>
                      Select Time
                    </ThemedText>
                    <TouchableOpacity onPress={handleTimeConfirm}>
                      <ThemedText style={[styles.confirmButton, { color: colors.tint }]}>
                        Done
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={tempDate}
                    mode="time"
                    onChange={handleTimeChange}
                    display="spinner"
                    textColor={colors.text}
                  />
                </ThemedView>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={tempDate}
              mode="time"
              onChange={handleTimeChange}
              display="default"
            />
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  timePickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  confirmButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  calendar: {
    borderRadius: 12,
  },
});

