package com.project3.backend.config;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;

@Component
public class WebSocketEventListener implements ApplicationListener<AbstractSubProtocolEvent> {

    @Override
    public void onApplicationEvent(AbstractSubProtocolEvent event) {
        System.out.println("Received WebSocket event: " + event);
    }
}
