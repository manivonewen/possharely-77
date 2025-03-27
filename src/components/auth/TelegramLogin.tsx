
import React, { useEffect } from 'react';

interface TelegramLoginProps {
  onLogin: (user: any) => void;
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({ onLogin }) => {
  useEffect(() => {
    // Save callback function to window object for Telegram to call
    window.onTelegramAuth = (user) => {
      console.log('Telegram auth user:', user);
      onLogin(user);
    };

    // Create and append the Telegram script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js';
    script.setAttribute('data-telegram-login', 'LoyversePOSCloneBot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;
    
    // Find or create the container element
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }

    // Clean up on unmount
    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
      delete window.onTelegramAuth;
    };
  }, [onLogin]);

  return <div id="telegram-login-container" className="telegram-login"></div>;
};

export default TelegramLogin;
