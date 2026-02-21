
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SubmittedSession, CreateSessionOutput } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const SUBMISSIONS_KEY = 'wellv_submissions';

export function useSubmissionStore() {
  const [submissions, setSubmissions] = useState<SubmittedSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Ref to hold the latest submissions to avoid stale state in callbacks
  const submissionsRef = useRef(submissions);
  useEffect(() => {
    submissionsRef.current = submissions;
  }, [submissions]);

  useEffect(() => {
    try {
      const submissionsJson = localStorage.getItem(SUBMISSIONS_KEY);
      if (submissionsJson) {
        const storedSubmissions = JSON.parse(submissionsJson);
        setSubmissions(storedSubmissions);
      }
    } catch (error) {
      console.error("Failed to load submissions from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveSubmissions = useCallback((subs: SubmittedSession[]) => {
    setSubmissions(subs);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
  }, []);

  const addSubmission = useCallback((newSubmission: Omit<SubmittedSession, 'id' | 'status' | 'submittedAt'>): string => {
    const id = uuidv4();
    const submission: SubmittedSession = {
        ...newSubmission,
        id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
    };
    // Use functional update to ensure we have the latest state
    setSubmissions(prevSubmissions => {
        const newSubmissions = [...prevSubmissions, submission];
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(newSubmissions));
        return newSubmissions;
    });
    return id;
  }, []);

  const updateSubmissionStatus = useCallback((id: string, status: SubmittedSession['status'], result?: CreateSessionOutput) => {
    // Use functional update to ensure we have the latest state
    setSubmissions(prevSubmissions => {
        const newSubmissions = prevSubmissions.map(sub => {
            if (sub.id === id) {
                return { 
                    ...sub, 
                    status, 
                    transcription: result?.transcription, 
                    approved: result?.approved,
                    thumbnailUrl: result?.thumbnailUrl,
                };
            }
            return sub;
        });
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(newSubmissions));
        return newSubmissions;
    });
  }, []);

  const removeSubmission = useCallback((id: string) => {
    setSubmissions(prevSubmissions => {
      const newSubmissions = prevSubmissions.filter(sub => sub.id !== id);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(newSubmissions));
      return newSubmissions;
    });
  }, []);

  const clearSubmissions = useCallback(() => {
    setSubmissions([]);
    localStorage.removeItem(SUBMISSIONS_KEY);
  }, []);

  const getSubmissionById = useCallback((id: string) => {
      return submissionsRef.current.find(sub => sub.id === id);
  }, []);


  return {
    isLoaded,
    submissions,
    addSubmission,
    updateSubmissionStatus,
    getSubmissionById,
    removeSubmission,
    clearSubmissions,
  };
}
