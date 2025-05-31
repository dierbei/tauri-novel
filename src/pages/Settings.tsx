import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LogOut, User, Bell, Shield, HelpCircle, Info } from 'lucide-react';
import LoginModal from '../components/LoginModal';

const Settings = () => {
  const { user, signOut } = useAppContext();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const menuItems = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: '通知设置',
      description: '管理推送和提醒'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '隐私与安全',
      description: '账号安全和数据保护'
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: '帮助与反馈',
      description: '常见问题解答和意见反馈'
    },
    {
      icon: <Info className="w-5 h-5" />,
      title: '关于我们',
      description: '应用版本和相关信息'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
        {/* User Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={user.avatar_url || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={user.email}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.email}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    注册于 {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="w-5 h-5" />
                退出登录
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                登录后可以同步阅读进度、收藏小说
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                登录 / 注册
              </button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="text-gray-500 dark:text-gray-400">{item.icon}</div>
              <div className="flex-1 text-left">
                <h3 className="text-gray-900 dark:text-white font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          版本 1.0.0
        </p>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Settings;