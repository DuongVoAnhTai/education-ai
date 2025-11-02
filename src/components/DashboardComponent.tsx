"use client";

import MessageComponent from "@/components/Message";
import QuizComponent from "@/components/QuizComponent";
import React, { useEffect, useMemo, useRef, useState, useCallback  } from "react";

import {
  BookOpen,
  MessageSquare,
  User as UserIcon,
  Settings,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Lock,
  Star,
  Hash,
  FileText,
  Play,
  X,
  Bell,
  Search,
  Menu,
  Camera,
} from "lucide-react";

/** =========================
 * Types khớp với Prisma Schema
 * =======================**/
type TabId = "dashboard" | "skills" | "quiz" | "chat" | "results" | "profile";

// Khớp với model Skills trong Prisma
interface Skill {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  // Extended fields cho UI
  progress?: number; // Tính từ Exercises
  tags?: string[]; // Từ SkillTags
  exerciseCount?: number;
  completedExercises?: number;
}

// Khớp với model Exercises
interface Exercise {
  id: string;
  skillId: string | null;
  title: string | null;
  description: string | null;
  ordering: number | null;
  timeLimitSeconds: number | null;
  passScore: number | null;
  createdAt: Date;
  updatedAt: Date;
  // Extended
  questionCount?: number;
  userScore?: number | null;
  isPassed?: boolean;
}

// Khớp với model Users
interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  role: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Result summary từ UserAnswers
interface ResultSummary {
  exerciseId: string;
  exerciseTitle: string;
  skillTitle: string;
  score: number;
  totalScore: number;
  submittedAt: Date;
}

/** =========================
 * Component
 * =======================**/
const EducationAIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State data - Sẽ fetch từ API
  const [skills, setSkills] = useState<Skill[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with real API calls
        // const [skillsData, exercisesData, resultsData, profileData] = await Promise.all([
        //   fetch('/api/skills').then(r => r.json()),
        //   fetch('/api/exercises').then(r => r.json()),
        //   fetch('/api/results').then(r => r.json()),
        //   fetch('/api/user/profile').then(r => r.json()),
        // ]);

        // Mock data for now
        const mockProfile: UserProfile = {
          id: "user-1",
          username: "student123",
          email: "student@example.com",
          fullName: "Nguyễn Văn A",
          role: "STUDENT",
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockSkills: Skill[] = [
          {
            id: "skill-1",
            ownerId: "user-1",
            title: "Natural Language Processing",
            description: "Học các kỹ thuật xử lý ngôn ngữ tự nhiên",
            visibility: "PRIVATE",
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            progress: 75,
            tags: ["AI", "ML", "NLP"],
            exerciseCount: 12,
            completedExercises: 9,
          },
          {
            id: "skill-2",
            ownerId: "user-1",
            title: "Machine Learning Fundamentals",
            description: "Các khái niệm cơ bản về Machine Learning",
            visibility: "PRIVATE",
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            progress: 45,
            tags: ["ML", "Python", "Data"],
            exerciseCount: 15,
            completedExercises: 7,
          },
          {
            id: "skill-3",
            ownerId: "user-1",
            title: "Deep Learning",
            description: "Neural Networks và Deep Learning",
            visibility: "PRIVATE",
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            progress: 0,
            tags: ["DeepLearning", "Neural"],
            exerciseCount: 20,
            completedExercises: 0,
          },
        ];

        const mockResults: ResultSummary[] = [
          {
            exerciseId: "ex-1",
            exerciseTitle: "NLP Cơ bản #1",
            skillTitle: "Natural Language Processing",
            score: 8,
            totalScore: 10,
            submittedAt: new Date(Date.now() - 86400000),
          },
          {
            exerciseId: "ex-2",
            exerciseTitle: "ML Quiz #3",
            skillTitle: "Machine Learning Fundamentals",
            score: 7,
            totalScore: 10,
            submittedAt: new Date(Date.now() - 172800000),
          },
        ];

        setProfile(mockProfile);
        setSkills(mockSkills);
        setResults(mockResults);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /** =========================
   * Sidebar
   * =======================**/
  const Sidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-blue-900 to-purple-900 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 bg-black/20">
        <h1 className="text-xl font-bold text-white">Education AI</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-8 px-4">
        {[
          { id: "dashboard", label: "Dashboard", icon: TrendingUp },
          { id: "skills", label: "Kỹ năng", icon: BookOpen },
          { id: "quiz", label: "Bài kiểm tra", icon: Award },
          { id: "chat", label: "Chat", icon: MessageSquare },
          { id: "results", label: "Kết quả", icon: Award },
          { id: "profile", label: "Hồ sơ", icon: UserIcon },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id as TabId);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 mt-2 text-left rounded-lg transition-colors duration-200 ${
              activeTab === item.id
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon size={20} className="mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  /** =========================
   * Header
   * =======================**/
  const [notifOpen, setNotifOpen] = useState(false);

  const handleSearchChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  },
  [] 
  );


  const Header = useMemo(() => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 relative">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
          >
            <Menu size={24} />
          </button>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              type="text"
              placeholder="Tìm kiếm kỹ năng, bài học..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setNotifOpen((s) => !s)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {results.length}
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Thông báo</p>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-auto">
                  {results.map((r) => (
                    <div
                      key={r.exerciseId}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <Star size={18} className="text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {r.exerciseTitle}: {r.score}/{r.totalScore}
                        </p>
                        <p className="text-xs text-gray-600">{r.skillTitle}</p>
                        <p className="text-[11px] text-gray-400">
                          {r.submittedAt.toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {profile?.fullName?.charAt(0) || "U"}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {profile?.fullName || profile?.username || "User"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [notifOpen, results, profile, setSidebarOpen, searchQuery, handleSearchChange]);


  /** =========================
   * Dashboard
   * =======================**/
  const totalCompleted = useMemo(
    () => skills.reduce((sum, skill) => sum + (skill.completedExercises || 0), 0),
    [skills]
  );
  
  const totalExercises = useMemo(
    () => skills.reduce((sum, skill) => sum + (skill.exerciseCount || 0), 0),
    [skills]
  );

  const DashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Kỹ năng đang học"
            value={skills.filter((s) => !s.isDeleted).length.toString()}
            icon={<BookOpen size={32} className="text-blue-200" />}
            gradient="from-blue-500 to-blue-600"
          />
          <SummaryCard
            title="Bài hoàn thành"
            value={totalCompleted.toString()}
            icon={<CheckCircle size={32} className="text-green-200" />}
            gradient="from-green-500 to-green-600"
          />
          <SummaryCard
            title="Tổng bài tập"
            value={totalExercises.toString()}
            icon={<FileText size={32} className="text-purple-200" />}
            gradient="from-purple-500 to-purple-600"
          />
          <SummaryCard
            title="Điểm TB"
            value={results.length > 0 
              ? (results.reduce((sum, r) => sum + (r.score / r.totalScore * 10), 0) / results.length).toFixed(1)
              : "0"}
            icon={<Star size={32} className="text-orange-200" />}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tiến độ học tập
            </h3>
            <div className="space-y-4">
              {skills.slice(0, 5).map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{skill.title}</h4>
                    <p className="text-xs text-gray-500">{skill.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {skill.progress || 0}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {skill.completedExercises}/{skill.exerciseCount} bài tập
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Kết quả gần đây
            </h3>
            <div className="space-y-4">
              {results.map((r) => (
                <div
                  key={r.exerciseId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{r.exerciseTitle}</h4>
                    <p className="text-sm text-gray-600">{r.skillTitle}</p>
                    <p className="text-xs text-gray-400">
                      {r.submittedAt.toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {r.score}/{r.totalScore}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((r.score / r.totalScore) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SummaryCard = ({
    title,
    value,
    icon,
    gradient,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    gradient: string;
  }) => (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );

  /** =========================
   * Skills Content
   * =======================**/
  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  }, [skills, searchQuery]);

  const SkillsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kỹ năng của tôi</h2>
        <button
          onClick={() => alert("Tính năng thêm kỹ năng - Cần tích hợp API")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          + Thêm kỹ năng mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {skill.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  skill.visibility === "PUBLIC" ? "bg-green-100 text-green-700" :
                  skill.visibility === "PRIVATE" ? "bg-gray-100 text-gray-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {skill.visibility}
                </span>
              </div>

              {skill.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {skill.description}
                </p>
              )}

              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {skill.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      <Hash size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>
                    {skill.completedExercises}/{skill.exerciseCount} bài
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {skill.progress || 0}% hoàn thành
                </p>
              </div>

              <button
                onClick={() => setActiveTab("quiz")}
                className="w-full py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-200"
              >
                Xem bài tập
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /** =========================
   * Results Content
   * =======================**/
  const ResultsContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảng kết quả</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Bài tập</th>
              <th className="py-2">Kỹ năng</th>
              <th className="py-2">Điểm</th>
              <th className="py-2">%</th>
              <th className="py-2">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.exerciseId} className="border-t">
                <td className="py-2 font-medium text-gray-900">{r.exerciseTitle}</td>
                <td className="py-2 text-gray-600">{r.skillTitle}</td>
                <td className="py-2">
                  {r.score}/{r.totalScore}
                </td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    (r.score / r.totalScore) >= 0.7 ? "bg-green-100 text-green-700" :
                    (r.score / r.totalScore) >= 0.5 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {((r.score / r.totalScore) * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="py-2 text-gray-500">
                  {r.submittedAt.toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /** =========================
   * Profile Content
   * =======================**/
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload to server/cloud storage
    // const formData = new FormData();
    // formData.append('avatar', file);
    // const response = await fetch('/api/user/avatar', { method: 'POST', body: formData });
    // const { avatarUrl } = await response.json();
    // setProfile(prev => prev ? { ...prev, avatarUrl } : null);

    alert("Tính năng upload avatar - Cần tích hợp API");
  };

  const ProfileContent = () => {
    if (!profile) return null;

    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hồ sơ cá nhân
          </h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.fullName?.charAt(0) || "U"}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white border shadow hover:shadow-md"
                title="Đổi ảnh"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>

            <div>
              <p className="font-medium text-lg">{profile.fullName || profile.username}</p>
              <p className="text-gray-600 text-sm">{profile.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                @{profile.username}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={profile.fullName || ""}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò
              </label>
              <input
                type="text"
                value={profile.role || "STUDENT"}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={() => alert("Tính năng cập nhật profile - Cần tích hợp API")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    );
  };

  /** =========================
   * Render
   * =======================**/
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "skills":
        return <SkillsContent />;
      case "quiz":
        return <QuizComponent />;
     case "chat":
  return (
    <div className="h-screen bg-white rounded-xl shadow-sm border border-gray-200 h-[640px] flex flex-col">
      <MessageComponent />
    </div>
  );

      case "results":
        return <ResultsContent />;
      case "profile":
        return <ProfileContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
  {Header}
  <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
    {renderContent()}
  </main>
</div>

    </div>
  );
};

export default EducationAIDashboard;