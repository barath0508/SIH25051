import { Users, MessageCircle, Calendar, Award, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export function CommunityHub() {
  const communityData = {
    activeUsers: 47,
    totalHouseholds: 98,
    energyShared: 12.4,
    communityRank: 3,
    events: [
      { id: 1, title: 'Energy Conservation Workshop', date: '2024-01-15', attendees: 23 },
      { id: 2, title: 'Solar Panel Maintenance', date: '2024-01-18', attendees: 8 },
      { id: 3, title: 'Community Meeting', date: '2024-01-22', attendees: 45 }
    ],
    messages: [
      { id: 1, user: 'Village Head', message: 'Great energy savings this week!', time: '2h ago' },
      { id: 2, user: 'Tech Support', message: 'Maintenance scheduled for tomorrow', time: '4h ago' },
      { id: 3, user: 'Resident', message: 'Solar panels working perfectly', time: '6h ago' }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <CardTitle>Community Hub</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-dark p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-400">{communityData.activeUsers}</div>
            <div className="text-xs text-purple-200">Active Users</div>
            <div className="text-xs text-emerald-300 mt-1">
              {Math.round((communityData.activeUsers / communityData.totalHouseholds) * 100)}% online
            </div>
          </div>
          <div className="glass-dark p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-400">{communityData.energyShared}</div>
            <div className="text-xs text-purple-200">kWh Shared Today</div>
            <div className="text-xs text-blue-300 mt-1">Between neighbors</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Community Ranking */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-bold text-white">Village Ranking</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-200 text-sm">Regional Efficiency Rank</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-400">#{communityData.communityRank}</span>
                <span className="text-xs text-yellow-300">out of 15</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white">Upcoming Events</span>
            </div>
            <div className="space-y-2">
              {communityData.events.slice(0, 2).map(event => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-white">{event.title}</div>
                    <div className="text-xs text-purple-300">{new Date(event.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs text-cyan-300">{event.attendees} attending</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold text-white">Community Feed</span>
            </div>
            <div className="space-y-3">
              {communityData.messages.slice(0, 2).map(msg => (
                <div key={msg.id} className="border-l-2 border-green-500/30 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{msg.user}</span>
                    <span className="text-xs text-purple-300">{msg.time}</span>
                  </div>
                  <div className="text-sm text-purple-200">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Status */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Wifi className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-bold text-white">Network Status</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-purple-300 mb-1">Internet</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-emerald-300 font-medium">Strong</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-300 mb-1">Mesh Network</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-300 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 glass-dark p-4 rounded-xl border border-purple-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-purple-300 mb-2">
                Community Collaboration Active
              </div>
              <div className="text-xs text-purple-200 leading-relaxed">
                Your village is part of a smart energy network where households can share excess power, 
                coordinate maintenance, and learn from each other's energy practices.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}