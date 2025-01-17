import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert
} from "react-native";
import { auth } from "../firebase/config.js";

const UserDetailsScreen = ({
  updateUserDetails,
  userInformation,
  userDetails,
  loading,
  setIsProfile
}) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Pre-fill form with existing data
    setName(userInformation?.displayName || "");
    setBio(userDetails?.bio || "");
    setPhone(userDetails?.phone || "");
  }, [userInformation, userDetails]);

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return false;
    }
    if (phone && !validatePhone(phone)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleUpdateDetails = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await updateUserDetails(auth.currentUser, { 
        name: name.trim(), 
        bio: bio.trim(), 
        phone: phone.trim() 
      });
      Alert.alert(
        "Success",
        "Your profile has been updated successfully",
        [{ text: "OK", onPress: () => setIsProfile(false) }]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Edit Profile</Text>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setIsProfile(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={[styles.input, !name.trim() && styles.inputError]}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, phone && !validatePhone(phone) && styles.inputError]}
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={[
              styles.saveButton,
              (isSubmitting || loading) && styles.saveButtonDisabled
            ]} 
            onPress={handleUpdateDetails}
            disabled={isSubmitting || loading}
          >
            {(isSubmitting || loading) ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, .1)",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "rgba(255, 255, 255, .7)",
  },

  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "rgba(255, 255, 255, .3)",
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#555",
    marginBottom: 16,
    color: "rgba(255, 255, 255, .3)",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
    paddingBottom: 12,
  },
  charCount: {
    fontSize: 12,
    color: "#666666",
    textAlign: "right",
    marginTop: -12,
    marginBottom: 16,
  },

  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  saveButtonDisabled: {
    backgroundColor: "#A8A8A8",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default UserDetailsScreen;