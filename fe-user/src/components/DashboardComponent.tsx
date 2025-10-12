"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import MessageComponent from "./Message";

/** =========================
 * Types
 * =======================**/
type TabId = "dashboard" | "skills" | "chat" | "results" | "profile";
type Level = "Beginner" | "Intermediate" | "Advanced";

type Skill = {
  id: string;
  name: string;
  progress: number; // 0..100
  level: Level;
  tags: string[];
  lessonsCompleted: number;
  totalLessons: number;
  nextLesson: string;
  locked: boolean;
};

type Result = {
  id: string;
  skill: string;
  score: number;
  totalScore: number;
  feedback: string;
  date: string;
};

type Profile = {
  name: string;
  email: string;
  goal: string;
  bio: string;
  /** new: ảnh đại diện (data URL) */
  avatar?: string;
};

/** =========================
 * Utilities
 * =======================**/
const persist = <T,>(key: string, value: T) =>
  localStorage.setItem(key, JSON.stringify(value));
const readPersist = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
};

/** =========================
 * Component
 * =======================**/
const EducationAIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchSkills, setSearchSkills] = useState("");

  /** --------- MOCK STATE (persisted) --------- */
  const [skills, setSkills] = useState<Skill[]>(
    readPersist<Skill[]>("edu.skills", [
      {
        id: "1",
        name: "Natural Language Processing",
        progress: 75,
        level: "Intermediate",
        tags: ["#AI", "#ML", "#NLP"],
        lessonsCompleted: 8,
        totalLessons: 12,
        nextLesson: "Sentiment Analysis",
        locked: false,
      },
      {
        id: "2",
        name: "Machine Learning Fundamentals",
        progress: 45,
        level: "Beginner",
        tags: ["#ML", "#Python", "#Data"],
        lessonsCompleted: 5,
        totalLessons: 15,
        nextLesson: "Linear Regression",
        locked: false,
      },
      {
        id: "3",
        name: "Deep Learning",
        progress: 0,
        level: "Advanced",
        tags: ["#DeepLearning", "#Neural"],
        lessonsCompleted: 0,
        totalLessons: 20,
        nextLesson: "Introduction to Neural Networks",
        locked: true,
      },
    ])
  );

  const [results, setResults] = useState<Result[]>(
    readPersist<Result[]>("edu.results", [
      {
        id: "r1",
        skill: "NLP Cơ bản #1",
        score: 8,
        totalScore: 10,
        feedback: "Bạn làm tốt, cần luyện thêm phần n-gram.",
        date: "2024-09-15",
      },
      {
        id: "r2",
        skill: "ML Quiz #3",
        score: 7,
        totalScore: 10,
        feedback: "Cải thiện hiểu biết về overfitting.",
        date: "2024-09-14",
      },
    ])
  );

  const [profile, setProfile] = useState<Profile>(
    readPersist<Profile>("edu.profile", {
      name: "Học viên",
      email: "student@example.com",
      goal: "Đạt 9.0/10 cho môn AI",
      bio: "Yêu thích học máy, xử lý ngôn ngữ tự nhiên và xây sản phẩm AI hữu ích.",
      avatar: undefined,
    })
  );

  /** Persist on change */
  useEffect(() => persist("edu.skills", skills), [skills]);
  useEffect(() => persist("edu.results", results), [results]);
  useEffect(() => persist("edu.profile", profile), [profile]);

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
  const Header = () => (
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
              value={searchSkills}
              onChange={(e) => setSearchSkills(e.target.value)}
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
                      key={r.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <Star size={18} className="text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Điểm {r.skill}: {r.score}/{r.totalScore}
                        </p>
                        <p className="text-xs text-gray-600">{r.feedback}</p>
                        <p className="text-[11px] text-gray-400">{r.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {profile.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  /** =========================
   * Dashboard
   * =======================**/
  const totalCompleted = useMemo(
    () => skills.reduce((s, k) => s + k.lessonsCompleted, 0),
    [skills]
  );
  const totalLessons = useMemo(
    () => skills.reduce((s, k) => s + k.totalLessons, 0),
    [skills]
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Kỹ năng đang học"
          value={skills.filter((s) => !s.locked).length.toString()}
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
          title="Tổng bài học"
          value={totalLessons.toString()}
          icon={<FileText size={32} className="text-purple-200" />}
          gradient="from-purple-500 to-purple-600"
        />
        <SummaryCard
          title="Thời gian học"
          value="127h"
          icon={<Clock size={32} className="text-orange-200" />}
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
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{skill.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {skill.progress}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => continueLesson(skill.id)}
                  className={`ml-4 px-3 py-2 text-sm rounded-lg font-medium ${
                    skill.locked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {skill.locked ? "Khoá" : "Tiếp tục"}
                </button>
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
                key={r.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{r.skill}</h4>
                  <p className="text-sm text-gray-600">{r.feedback}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {r.score}/{r.totalScore}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addRandomResult}
            className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <FileText size={16} />
            Thêm kết quả giả lập
          </button>
        </div>
      </div>
    </div>
  );

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

  /** Actions */
  const continueLesson = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id !== id || s.locked) return s;
        const lessonsCompleted = Math.min(
          s.lessonsCompleted + 1,
          s.totalLessons
        );
        const progress = Math.round((lessonsCompleted / s.totalLessons) * 100);
        return { ...s, lessonsCompleted, progress };
      })
    );
  };

  const addRandomResult = () => {
    const sample: Result = {
      id: `r${Date.now()}`,
      skill: "Practice Quiz",
      score: 6 + Math.floor(Math.random() * 5),
      totalScore: 10,
      feedback: "Bài làm ổn, luyện thêm phần lý thuyết.",
      date: new Date().toISOString().slice(0, 10),
    };
    setResults((r) => [sample, ...r]);
  };

  /** =========================
   * Skills
   * =======================**/
  const filteredSkills = useMemo(() => {
    const q = searchSkills.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tags.join(" ").toLowerCase().includes(q) ||
        s.nextLesson.toLowerCase().includes(q)
    );
  }, [skills, searchSkills]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Skill>({
    id: "",
    name: "",
    progress: 0,
    level: "Beginner",
    tags: [],
    lessonsCompleted: 0,
    totalLessons: 10,
    nextLesson: "",
    locked: false,
  });

  const openCreateSkill = () => {
    setEditingId(null);
    setForm({
      id: "",
      name: "",
      progress: 0,
      level: "Beginner",
      tags: [],
      lessonsCompleted: 0,
      totalLessons: 10,
      nextLesson: "",
      locked: false,
    });
    setFormOpen(true);
  };

  const openEditSkill = (s: Skill) => {
    setEditingId(s.id);
    setForm({ ...s, tags: [...s.tags] });
    setFormOpen(true);
  };

  const submitSkill = () => {
    if (!form.name.trim()) return alert("Nhập tên kỹ năng");
    const safe = { ...form, id: form.id || `${Date.now()}` };
    if (editingId) {
      setSkills((prev) => prev.map((s) => (s.id === editingId ? safe : s)));
    } else {
      setSkills((prev) => [safe, ...prev]);
    }
    setFormOpen(false);
  };

  const deleteSkill = (id: string) => {
    if (!confirm("Xoá kỹ năng này?")) return;
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const SkillsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kỹ năng của tôi</h2>
        <button
          onClick={openCreateSkill}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {skill.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditSkill(skill)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Chỉnh sửa"
                  >
                    <Settings size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Xoá"
                  >
                    <X size={18} className="text-red-500" />
                  </button>

                  {skill.locked ? (
                    <Lock size={20} className="text-gray-400" />
                  ) : (
                    <Play size={20} className="text-green-500" />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {skill.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    <Hash size={10} className="mr-1" />
                    {tag.replace("#", "")}
                  </span>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>
                    {skill.lessonsCompleted}/{skill.totalLessons} bài
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Bài tiếp theo:</span>{" "}
                  {skill.nextLesson || "—"}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    skill.level === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : skill.level === "Intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {skill.level}
                </span>
              </div>

              <button
                onClick={() => continueLesson(skill.id)}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  skill.locked
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
                }`}
                disabled={skill.locked}
              >
                {skill.locked ? "Chưa mở khóa" : "Tiếp tục học"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal form */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? "Chỉnh sửa kỹ năng" : "Thêm kỹ năng mới"}
              </h3>
              <button onClick={() => setFormOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-gray-700">Tên kỹ năng</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  placeholder="VD: Computer Vision"
                />
              </label>

              <div className="grid grid-cols-3 gap-3">
                <label className="block col-span-2">
                  <span className="text-sm text-gray-700">Bài tổng</span>
                  <input
                    type="number"
                    value={form.totalLessons}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        totalLessons: Math.max(1, +e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">Đã xong</span>
                  <input
                    type="number"
                    value={form.lessonsCompleted}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lessonsCompleted: Math.max(0, +e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-gray-700">Bài tiếp theo</span>
                <input
                  value={form.nextLesson}
                  onChange={(e) =>
                    setForm({ ...form, nextLesson: e.target.value })
                  }
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-gray-700">Cấp độ</span>
                  <select
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value as Level })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Khoá?</span>
                  <select
                    value={form.locked ? "yes" : "no"}
                    onChange={(e) =>
                      setForm({ ...form, locked: e.target.value === "yes" })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  >
                    <option value="no">Không</option>
                    <option value="yes">Có</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-gray-700">
                  Tag (phân tách bởi khoảng trắng)
                </span>
                <input
                  value={form.tags.join(" ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tags: e.target.value
                        .split(" ")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((t) => (t.startsWith("#") ? t : `#${t}`)),
                    })
                  }
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  placeholder="#AI #ML"
                />
              </label>

              <div className="text-xs text-gray-500">
                * Tiến độ sẽ tính theo Đã xong/Tổng bài khi lưu.
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Huỷ
                </button>
                <button
                  onClick={() => {
                    const progress = Math.round(
                      (form.lessonsCompleted / Math.max(1, form.totalLessons)) *
                        100
                    );
                    submitSkill();
                    setSkills((prev) =>
                      prev.map((s) =>
                        (editingId && s.id === editingId) ||
                        (!editingId && s.id === form.id)
                          ? { ...s, progress }
                          : s
                      )
                    );
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /** =========================
   * Chat
   * =======================**/
  const ChatContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[640px] overflow-hidden">
      <MessageComponent />
    </div>
  );

  /** =========================
   * Results
   * =======================**/
  const ResultsContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bảng kết quả</h3>
        <button
          onClick={addRandomResult}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <FileText size={16} />
          Thêm kết quả mock
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Kỹ năng</th>
              <th className="py-2">Điểm</th>
              <th className="py-2">Nhận xét</th>
              <th className="py-2">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2 font-medium text-gray-900">{r.skill}</td>
                <td className="py-2">
                  {r.score}/{r.totalScore}
                </td>
                <td className="py-2 text-gray-600">{r.feedback}</td>
                <td className="py-2 text-gray-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /** =========================
   * Profile (with avatar upload)
   * =======================**/
  const fileRef = useRef<HTMLInputElement>(null);

  const pickAvatar = () => fileRef.current?.click();

  const onAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const f = e.target.files?.[0];
    if (!f) return;
    // đọc thành base64 để lưu được trong localStorage
    const toDataURL = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
    try {
      const dataUrl = await toDataURL(f);
      setProfile((p) => ({ ...p, avatar: dataUrl }));
    } catch {
      alert("Không thể đọc ảnh. Vui lòng thử ảnh khác.");
    } finally {
      e.target.value = "";
    }
  };

  const ProfileContent = () => (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hồ sơ cá nhân
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                <UserIcon />
              </div>
            )}
            <button
              onClick={pickAvatar}
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
              onChange={onAvatarChange}
            />
          </div>

          <div>
            <p className="font-medium">{profile.name}</p>
            <p className="text-gray-600 text-sm">{profile.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Ảnh sẽ được lưu cục bộ trên trình duyệt của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Tên</span>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700">Mục tiêu</span>
            <input
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700">Giới thiệu</span>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
        </div>

        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Đã lưu (auto)
          </button>
        </div>
      </div>
    </div>
  );

  /** =========================
   * Render
   * =======================**/
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return DashboardContent();
      case "skills":
        return SkillsContent();
      case "chat":
        return ChatContent();
      case "results":
        return ResultsContent();
      case "profile":
        return ProfileContent();
      default:
        return DashboardContent();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {Sidebar()}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {Header()}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EducationAIDashboard;
