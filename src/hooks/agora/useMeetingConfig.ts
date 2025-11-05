import { useState, useEffect } from 'react';
import { MeetingConfig } from '@/types/agora';

export const useMeetingConfig = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [meetingConfig, setMeetingConfig] = useState<MeetingConfig | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchMeetingConfig = async () => {
      try {
        // Get user name from localStorage
        const storedUserName = localStorage.getItem('userName') || 'Guest User';
        setUserName(storedUserName);

        // Extract meeting ID from URL
        const pathParts = window.location.pathname.split('/');
        const meetingId = pathParts[pathParts.length - 1];

        // Simulate API call - Replace with actual backend call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Hardcoded config for now - Replace with actual API response
        const config: MeetingConfig = {
          appId: '047a19e2cb20493ab84e27460aa857f8',
          token: '007eJxTYJgavoZL2zmr9Mm7zamO/sxnmxj9KmuebQo5HNmU8vIHB7cCg4GJeaKhZapRcpKRgYmlcWKShUmqkbmJmUFiooWpeZoF83vOzIZARoZ/L1iZGRkgEMTnYkjJT85LLYlPLChgYAAAsnogog==',
          channelName: 'docnet_app'
        };

        setMeetingConfig(config);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching meeting config:', error);
        setIsLoading(false);
      }
    };

    fetchMeetingConfig();
  }, []);

  return { isLoading, meetingConfig, userName };
};
