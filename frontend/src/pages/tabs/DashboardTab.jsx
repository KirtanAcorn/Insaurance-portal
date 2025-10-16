import { 
  FileText, 
  AlertCircle, 
  DollarSign, 
  Users, 
  Activity, 
  Eye, 
  Home, 
  AlertTriangle, 
  Truck, 
  Globe, 
  CheckCircle, 
  Shield,
  Sun,
  Moon
} from 'lucide-react';
import StatsCards from '../../components/dashboard/StatsCards';
import RecentActivity from '../../components/dashboard/RecentActivity';
import PolicyOverview from '../../components/dashboard/PolicyOverview';
import QuickStats from '../../components/dashboard/QuickStats';

const DashboardTab = ({isDark, statsDataDashboard, recentActivityDashboard, policiesDashboard, quickStats, getColorClassesDashbaord}) => {

  return (
    <>
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>

      {/* Main Content */}
        {/* Stats Cards */}
        <StatsCards
        isDark={isDark}
        statsDataDashboard={statsDataDashboard}
        getColorClassesDashbaord={getColorClassesDashbaord}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <RecentActivity
          isDark={isDark}
          recentActivityDashboard={recentActivityDashboard}
          />

          {/* Right Column */}
          <div className="space-y-8">
            {/* Policy Overview */}
            {/* <PolicyOverview
            isDark={isDark}
            policiesDashboard={policiesDashboard}
            /> */}

            {/* Quick Stats */}
            <QuickStats
            isDark={isDark}
            getColorClassesDashbaord={getColorClassesDashbaord}
            quickStats={quickStats}
            />
          </div>
        </div>
    </div>
    </>
  );
};

export default DashboardTab;