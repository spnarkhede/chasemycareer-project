import { supabase } from './supabase';
import type {
  UserOnboarding,
  DailyTask,
  JobApplication,
  Interview,
  Document,
  NetworkingContact,
  NetworkingMessage,
  InterviewQuestion,
  InterviewPracticeSession,
} from '@/types';

// User Onboarding
export const getUserOnboarding = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_onboarding')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createOrUpdateOnboarding = async (userId: string, onboarding: Partial<UserOnboarding>) => {
  const { data, error } = await supabase
    .from('user_onboarding')
    .upsert({
      user_id: userId,
      ...onboarding,
      completed_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Daily Tasks
export const getDailyTasks = async (userId: string, dayNumber?: number) => {
  try {
    let query = supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('day_number', { ascending: true });

    if (dayNumber) {
      query = query.eq('day_number', dayNumber);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching daily tasks:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in getDailyTasks:', error);
    return [];
  }
};

export const createDailyTask = async (task: Partial<DailyTask>) => {
  const { data, error } = await supabase
    .from('daily_tasks')
    .insert(task)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateDailyTask = async (taskId: string, updates: Partial<DailyTask>) => {
  const { data, error } = await supabase
    .from('daily_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
  const { data, error } = await supabase
    .from('daily_tasks')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Job Applications
export const getJobApplications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in getJobApplications:', error);
    return [];
  }
};

export const createJobApplication = async (application: Partial<JobApplication>) => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert(application)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateJobApplication = async (applicationId: string, updates: Partial<JobApplication>) => {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteJobApplication = async (applicationId: string) => {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', applicationId);

  if (error) throw error;
};

// Interviews
export const getInterviews = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*, job_applications(*)')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });

    if (error) {
      console.error('Error fetching interviews:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in getInterviews:', error);
    return [];
  }
};

export const getUpcomingInterviews = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*, job_applications(*)')
      .eq('user_id', userId)
      .eq('completed', false)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching upcoming interviews:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in getUpcomingInterviews:', error);
    return [];
  }
};

export const createInterview = async (interview: Partial<Interview>) => {
  const { data, error } = await supabase
    .from('interviews')
    .insert(interview)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateInterview = async (interviewId: string, updates: Partial<Interview>) => {
  const { data, error } = await supabase
    .from('interviews')
    .update(updates)
    .eq('id', interviewId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteInterview = async (interviewId: string) => {
  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', interviewId);

  if (error) throw error;
};

// Documents
export const getDocuments = async (userId: string, documentType?: 'Resume' | 'CoverLetter') => {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (documentType) {
    query = query.eq('document_type', documentType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createDocument = async (document: Partial<Document>) => {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateDocument = async (documentId: string, updates: Partial<Document>) => {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', documentId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteDocument = async (documentId: string) => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) throw error;
};

// Networking Contacts
export const getNetworkingContacts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('networking_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false});

    if (error) {
      console.error('Error fetching networking contacts:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in getNetworkingContacts:', error);
    return [];
  }
};

export const createNetworkingContact = async (contact: Partial<NetworkingContact>) => {
  const { data, error } = await supabase
    .from('networking_contacts')
    .insert(contact)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateNetworkingContact = async (contactId: string, updates: Partial<NetworkingContact>) => {
  const { data, error } = await supabase
    .from('networking_contacts')
    .update(updates)
    .eq('id', contactId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteNetworkingContact = async (contactId: string) => {
  const { error } = await supabase
    .from('networking_contacts')
    .delete()
    .eq('id', contactId);

  if (error) throw error;
};

// Networking Messages
export const getNetworkingMessages = async (userId: string, contactId?: string) => {
  let query = supabase
    .from('networking_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (contactId) {
    query = query.eq('contact_id', contactId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getMessageTemplates = async (userId: string) => {
  const { data, error } = await supabase
    .from('networking_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('is_template', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createNetworkingMessage = async (message: Partial<NetworkingMessage>) => {
  const { data, error } = await supabase
    .from('networking_messages')
    .insert(message)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateNetworkingMessage = async (messageId: string, updates: Partial<NetworkingMessage>) => {
  const { data, error } = await supabase
    .from('networking_messages')
    .update(updates)
    .eq('id', messageId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteNetworkingMessage = async (messageId: string) => {
  const { error } = await supabase
    .from('networking_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
};

// Interview Questions
export const getInterviewQuestions = async (category?: string) => {
  let query = supabase
    .from('interview_questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getUserInterviewQuestions = async (userId: string) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_system', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createInterviewQuestion = async (question: Partial<InterviewQuestion>) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .insert(question)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateInterviewQuestion = async (questionId: string, updates: Partial<InterviewQuestion>) => {
  const { data, error } = await supabase
    .from('interview_questions')
    .update(updates)
    .eq('id', questionId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteInterviewQuestion = async (questionId: string) => {
  const { error } = await supabase
    .from('interview_questions')
    .delete()
    .eq('id', questionId);

  if (error) throw error;
};

// Interview Practice Sessions
export const getInterviewPracticeSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('interview_practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createInterviewPracticeSession = async (session: Partial<InterviewPracticeSession>) => {
  const { data, error } = await supabase
    .from('interview_practice_sessions')
    .insert(session)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Analytics
export const getAnalytics = async (userId: string) => {
  const [applications, tasks, interviews, contacts] = await Promise.all([
    getJobApplications(userId),
    getDailyTasks(userId),
    getInterviews(userId),
    getNetworkingContacts(userId),
  ]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const applicationsByStatus = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const upcomingInterviews = interviews.filter(
    i => !i.completed && new Date(i.scheduled_at) >= new Date()
  ).length;

  return {
    totalApplications: applications.length,
    completedTasks,
    totalTasks,
    progressPercentage,
    applicationsByStatus,
    upcomingInterviews,
    totalContacts: contacts.length,
    recentApplications: applications.slice(0, 5),
  };
};
