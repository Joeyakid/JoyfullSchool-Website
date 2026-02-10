'use client';

import RoleCard from '@/components/RoleCard';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

export default function LoginSelectionPage() {
  const roles = [
    {
      role: 'Student Portal',
      description: 'Login to view your results and courses.',
      href: '/login/student',
      icon: <GraduationCap className="w-8 h-8" />
    },
    {
      role: 'Lecturer Portal',
      description: 'Login to manage courses and upload results.',
      href: '/login/lecturer',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      role: 'Staff Portal',
      description: 'Login for administrative tasks.',
      href: '/login/staff',
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Select Login Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please choose your role to continue
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <RoleCard
              key={role.href}
              role={role.role}
              description={role.description}
              href={role.href}
              icon={role.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
