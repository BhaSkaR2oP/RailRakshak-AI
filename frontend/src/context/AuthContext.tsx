import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, PermittedArea } from '../types';

export const PERMITTED_LOCATIONS: PermittedArea[] = [
  {
    id: 'SEC-001',
    name: 'Delhi Section',
    zone: 'Northern Railway (NR)',
    division: 'Delhi Division (DLI)',
    center: [28.6139, 77.2090],
    zoom: 12,
    polygon: [
      [28.7500, 77.1000],
      [28.7500, 77.3200],
      [28.5000, 77.3200],
      [28.5000, 77.1000],
    ],
    radiusKm: 35,
  },
  {
    id: 'SEC-002',
    name: 'Mumbai Section',
    zone: 'Western Railway (WR)',
    division: 'Mumbai Central (MMCT)',
    center: [19.0760, 72.8777],
    zoom: 12,
    polygon: [
      [19.2500, 72.7800],
      [19.2500, 73.0200],
      [18.9000, 73.0200],
      [18.9000, 72.7800],
    ],
    radiusKm: 40,
  },
  {
    id: 'SEC-003',
    name: 'Lucknow Section',
    zone: 'North Eastern Railway (NER)',
    division: 'Lucknow Division (LJN)',
    center: [26.8467, 80.9462],
    zoom: 12,
    polygon: [
      [26.9500, 80.8200],
      [26.9500, 81.0800],
      [26.7200, 81.0800],
      [26.7200, 80.8200],
    ],
    radiusKm: 30,
  },
  {
    id: 'SEC-004',
    name: 'Jaipur Section',
    zone: 'North Western Railway (NWR)',
    division: 'Jaipur Division (JP)',
    center: [26.9124, 75.7873],
    zoom: 12,
    polygon: [
      [27.0200, 75.6800],
      [27.0200, 75.9200],
      [26.8000, 75.9200],
      [26.8000, 75.6800],
    ],
    radiusKm: 30,
  },
  {
    id: 'ALL',
    name: 'All Indian Railway Zones',
    zone: 'Railway Board — Ministry of Railways',
    division: 'National Command Headquarters',
    center: [24.5, 78.5],
    zoom: 5,
  },
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-delhi-1',
    name: 'Er. Rahul Verma',
    email: 'r.verma@nr.railrakshak.in',
    role: 'DIVISION_OFFICER',
    roleTitle: 'Senior Divisional Safety Officer',
    badgeId: 'NR-DLI-8842',
    avatarInitials: 'RV',
    permittedSectionId: 'SEC-001',
    permittedArea: PERMITTED_LOCATIONS[0],
  },
  {
    id: 'user-mumbai-1',
    name: 'Er. Priya Patel',
    email: 'p.patel@wr.railrakshak.in',
    role: 'DIVISION_OFFICER',
    roleTitle: 'Western Zone Safety Officer',
    badgeId: 'WR-BCT-5109',
    avatarInitials: 'PP',
    permittedSectionId: 'SEC-002',
    permittedArea: PERMITTED_LOCATIONS[1],
  },
  {
    id: 'user-lucknow-1',
    name: 'Er. Vikram Singh',
    email: 'v.singh@ner.railrakshak.in',
    role: 'DIVISION_OFFICER',
    roleTitle: 'North Eastern Safety Officer',
    badgeId: 'NER-LKO-3012',
    avatarInitials: 'VS',
    permittedSectionId: 'SEC-003',
    permittedArea: PERMITTED_LOCATIONS[2],
  },
  {
    id: 'user-jaipur-1',
    name: 'Er. Suresh Yadav',
    email: 's.yadav@nwr.railrakshak.in',
    role: 'DIVISION_OFFICER',
    roleTitle: 'North Western Safety Officer',
    badgeId: 'NWR-JP-7411',
    avatarInitials: 'SY',
    permittedSectionId: 'SEC-004',
    permittedArea: PERMITTED_LOCATIONS[3],
  },
  {
    id: 'user-hq-1',
    name: 'Dr. Ashwini Roy',
    email: 'hq@railrakshak.in',
    role: 'SUPER_ADMIN',
    roleTitle: 'Chief Safety Commissioner (National HQ)',
    badgeId: 'IR-HQ-0001',
    avatarInitials: 'AR',
    permittedSectionId: 'ALL',
    permittedArea: PERMITTED_LOCATIONS[4],
  },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithLocation: (nidOrEmail: string, locationId: string) => boolean;
  loginAsUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('railrakshak_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[0];
      }
    }
    return DEMO_USERS[0]; // Default logged-in user: Delhi Division Officer
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('railrakshak_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('railrakshak_auth_user');
    }
  }, [user]);

  const loginWithLocation = (nidOrEmail: string, locationId: string): boolean => {
    const term = nidOrEmail.trim().toLowerCase();
    
    // Check known location
    const matchedLoc = PERMITTED_LOCATIONS.find(l => l.id === locationId) || PERMITTED_LOCATIONS[0];
    
    // Check known user
    const matchedUser = DEMO_USERS.find(
      u => u.badgeId.toLowerCase() === term || u.email.toLowerCase() === term
    );

    if (matchedUser) {
      // If user specifically picked a location from dropdown, update jurisdiction to conform with selection
      if (locationId && locationId !== matchedUser.permittedSectionId) {
        setUser({
          ...matchedUser,
          permittedSectionId: matchedLoc.id,
          permittedArea: matchedLoc,
          role: matchedLoc.id === 'ALL' ? 'SUPER_ADMIN' : 'DIVISION_OFFICER',
        });
      } else {
        setUser(matchedUser);
      }
      return true;
    }

    // Custom user
    const isHQ = matchedLoc.id === 'ALL';
    const custom: User = {
      id: `user-${Date.now()}`,
      name: `Officer ${nidOrEmail.toUpperCase()}`,
      email: `${term.replace(/[^a-z0-9]/g, '')}@railrakshak.in`,
      role: isHQ ? 'SUPER_ADMIN' : 'DIVISION_OFFICER',
      roleTitle: isHQ ? 'National Safety Commissioner' : `Divisional Safety Officer (${matchedLoc.name})`,
      badgeId: nidOrEmail.toUpperCase(),
      avatarInitials: nidOrEmail.slice(0, 2).toUpperCase(),
      permittedSectionId: matchedLoc.id,
      permittedArea: matchedLoc,
    };
    setUser(custom);
    return true;
  };

  const loginAsUser = (targetUser: User) => {
    setUser(targetUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithLocation,
        loginAsUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
