
'use client';

import { useSubmissionStore } from '@/lib/hooks/use-submission-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, CheckCircle, XCircle, AlertTriangle, FileText, Trash2, ChevronDown, Eraser } from 'lucide-react';
import React from 'react';
import messages from '@/../messages/ja.json';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const t = messages.SubmittedPage;

const StatusInfo = {
  pending: {
    label: t.status.pending,
    icon: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
    color: 'bg-gray-200 text-gray-800',
  },
  processing: {
    label: t.status.processing,
    icon: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
    color: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: t.status.completed,
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    color: 'bg-green-100 text-green-800',
  },
  failed: {
    label: t.status.failed,
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    color: 'bg-red-100 text-red-800',
  },
};

const ApprovalInfo = {
    approved: {
        label: t.approval.approved,
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        color: 'border-green-300 bg-green-50 text-green-800'
    },
    rejected: {
        label: t.approval.rejected,
        icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
        color: 'border-yellow-300 bg-yellow-50 text-yellow-800'
    }
}

export function SubmittedSessions() {
  const { submissions, isLoaded, removeSubmission, clearSubmissions } = useSubmissionStore();

  const sortedSubmissions = React.useMemo(() => {
    return [...submissions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [submissions]);

  return (
    <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </div>
            {submissions.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eraser className="h-4 w-4 mr-2" />
                    {t.clear_all_button}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t.clear_all_dialog_title}</AlertDialogTitle>
                    <AlertDialogDescription>{t.clear_all_dialog_description}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel_button}</AlertDialogCancel>
                    <AlertDialogAction onClick={clearSubmissions} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {t.confirm_delete_button}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
             {!isLoaded && (
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                </div>
            )}

            {isLoaded && submissions.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-xl bg-card">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-bold">{t.no_submissions_title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{t.no_submissions_description}</p>
                </div>
            )}

            {isLoaded && submissions.length > 0 && (
                <div className="space-y-4">
                {sortedSubmissions.map((sub) => {
                    const statusInfo = StatusInfo[sub.status];
                    const approvalInfo = sub.approved === undefined ? null : (sub.approved ? ApprovalInfo.approved : ApprovalInfo.rejected);
                    return (
                    <Collapsible key={sub.id} asChild>
                      <Card className="bg-background/50 group">
                          <div className="flex items-center pr-4">
                            <CollapsibleTrigger asChild className="flex-1">
                              <div className="p-4 flex items-center cursor-pointer">
                                {sub.thumbnailUrl && (
                                    <div className="relative w-16 h-9 rounded-md overflow-hidden mr-4 shrink-0">
                                        <Image src={sub.thumbnailUrl} alt={sub.title} fill className="object-cover"/>
                                    </div>
                                )}
                                <div className='flex-1'>
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <p className="font-semibold text-sm">{sub.title}</p>
                                          <p className='mt-1 text-xs text-muted-foreground'>
                                          {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true, locale: ja })}
                                          </p>
                                      </div>
                                      <Badge className={cn(`flex items-center gap-1.5 hover:${statusInfo.color} text-xs`, statusInfo.color)}>
                                          {statusInfo.icon}
                                          {statusInfo.label}
                                      </Badge>
                                  </div>
                                </div>
                                <ChevronDown className="h-4 w-4 ml-3 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </CollapsibleTrigger>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="h-4 w-4"/>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t.delete_dialog_title}</AlertDialogTitle>
                                  <AlertDialogDescription>「{sub.title}」 {t.delete_dialog_description}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t.cancel_button}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeSubmission(sub.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {t.confirm_delete_button}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          
                          <CollapsibleContent>
                            {sub.status === 'completed' && approvalInfo && (
                            <div className="px-4 pb-4 space-y-3 text-xs">
                                <div className={`p-2 border rounded-md flex items-center gap-2 ${approvalInfo.color}`}>
                                    {approvalInfo.icon}
                                    <span className="font-semibold">{t.analysis_result}</span>
                                    <span>{approvalInfo.label}</span>
                                </div>
                                <div>
                                    <h4 className='text-xs font-semibold mb-1 text-muted-foreground'>{t.transcription_label}</h4>
                                    <p className="text-xs text-muted-foreground bg-slate-50 p-2 rounded-md border max-h-20 overflow-y-auto">
                                        {sub.transcription || t.transcription_failed}
                                    </p>
                                </div>
                            </div>
                            )}
                          </CollapsibleContent>
                      </Card>
                    </Collapsible>
                    );
                })}
                </div>
            )}
        </CardContent>
    </Card>
  );
}
