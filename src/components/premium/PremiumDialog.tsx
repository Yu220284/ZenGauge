'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

interface PremiumDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature?: string
}

export function PremiumDialog({ open, onOpenChange, feature = 'この機能' }: PremiumDialogProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">プレミアム会員限定機能</DialogTitle>
          <DialogDescription className="text-center">
            {feature}はプレミアム会員限定です。
            <br />
            プレミアムプランにアップグレードしてご利用ください。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button onClick={() => { onOpenChange(false); router.push('/premium') }} size="lg">
            <Crown className="mr-2 h-4 w-4" />
            プレミアム会員になる
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="lg">
            キャンセル
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
