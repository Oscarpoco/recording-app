import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SignIn({
    changeView,
    showPassword,
    setShowPassword,
    login,
    email,
    password,
    setEmail,
    setPassword,
    loading
}) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.form}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Login</Text>
                        <Text style={styles.subtitle}>Please sign in to continue</Text>
                    </View>

                    {/* Email Field */}
                    <View style={styles.fieldContainer}>
                        <Feather name="mail" size={20} color="#7B8794" />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#7B8794"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Field */}
                    <View style={styles.fieldContainer}>
                        <Feather name="lock" size={20} color="#7B8794" />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#7B8794"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather 
                                name={showPassword ? 'eye' : 'eye-off'} 
                                size={20} 
                                color="#7B8794" 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.button} onPress={login}>
                        <Text style={styles.buttonText}>
                            
                            {loading ? <ActivityIndicator/> : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    {/* Sign Up Section */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => changeView('signUp')}>
                            <Text style={styles.signupLink}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    form: {
        paddingHorizontal: 20, 
        width: '100%', 
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7B8794',
        textAlign: 'center',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E7EB',
        paddingVertical: 12,
        marginBottom: 16,
        width: '100%', // Ensure it stretches full width
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1A1A1A',
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#4A5568',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#2B6CB0',
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#2B6CB0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#4A5568',
        fontSize: 14,
    },
    signupLink: {
        color: '#2B6CB0',
        fontSize: 14,
        fontWeight: '600',
    },
});
