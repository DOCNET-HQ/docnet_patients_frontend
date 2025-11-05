import AgoraVideoCall from '@/components/agora/AgoraVideoCall';

interface MeetingPageProps {
  params: {
    meetingId: string;
  };
}

export default function MeetingPage({ params }: MeetingPageProps) {
  return (
    // h full + 10%
    <div className="h-[100vh] w-full -mt-6 overflow-hidden">
      <AgoraVideoCall />
    </div>
  );
}

export async function generateMetadata({ params }: MeetingPageProps) {
  return {
    title: `Consultation - ${params.meetingId}`,
    description: 'Join your telemedicine consultation',
  };
}
