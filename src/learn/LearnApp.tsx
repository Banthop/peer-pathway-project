import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LearnLayout from './components/layout/LearnLayout';
import LearnHome from './pages/LearnHome';
import ModuleView from './pages/ModuleView';
import LessonView from './pages/LessonView';

export default function LearnApp() {
  return (
    <LearnLayout>
      <Routes>
        <Route index element={<LearnHome />} />
        <Route path="module/:moduleId" element={<ModuleView />} />
        <Route path="module/:moduleId/lesson/:lessonId" element={<LessonView />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </LearnLayout>
  );
}
