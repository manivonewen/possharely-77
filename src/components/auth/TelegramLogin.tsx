
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TelegramLoginProps {
  buttonSize?: 'large' | 'medium' | 'small';
  showUserPic?: boolean;
  cornerRadius?: number;
  requestAccess?: 'write' | 'read';
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({
  buttonSize = 'medium',
  showUserPic = false,
  cornerRadius = 8,
  requestAccess = 'write',
}) => {
  const { telegramLogin } = useAuth();

  useEffect(() => {
    // Save callback function to window object for Telegram to call
    window.onTelegramAuth = (user) => {
      console.log('Telegram auth user:', user);
      telegramLogin(user);
    };

    // Create and append the Telegram script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js';
    script.setAttribute('data-telegram-login', 'LoyversePOSCloneBot');
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-userpic', showUserPic.toString());
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-bot-id', '7950428645');
    script.async = true;
    
    // Find or create the container element
    const container = document.getElementById('telegram-login-container');
    if (container) {
      // Clear container before appending to prevent duplicates
      container.innerHTML = '';
      container.appendChild(script);
    }

    // Clean up on unmount
    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
      delete window.onTelegramAuth;
    };
  }, [telegramLogin, buttonSize, showUserPic, cornerRadius, requestAccess]);

  return (
    <div id="telegram-login-container" className="telegram-login min-h-[36px]"></div>
  );
};

export default TelegramLogin;
