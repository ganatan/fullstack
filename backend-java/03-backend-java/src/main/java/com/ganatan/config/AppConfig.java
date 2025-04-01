package com.ganatan.config;

import java.io.InputStream;
import java.util.Properties;

public class AppConfig {
    private static final Properties properties = new Properties();
    
    static {
    	System.out.println("00000000001:AppConfig ");
        try (InputStream input = AppConfig.class.getClassLoader().getResourceAsStream("application.properties")) {
            properties.load(input);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load config", e);
        }
    }

    public static String useDbClient() {
        return properties.getProperty("db.client", "mock");
    }
}
