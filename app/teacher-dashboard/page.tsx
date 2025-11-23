'use client';

import DashboardLayout from "../dashboard/layout";

export default function TeacherDashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-heading mb-4">Velkommen til dit dashboard</h2>
      <p>Her kan du se dine bookinger og booke lokaler.</p>
    </DashboardLayout>
  );
}
