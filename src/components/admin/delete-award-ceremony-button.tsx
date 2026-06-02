'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
} from '@/components/ui/alert-dialog'
import { deleteAwardCeremony } from '@/lib/actions/award-ceremonies'

export function DeleteAwardCeremonyButton({
  id,
  title,
}: {
  id: string
  title: string
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAwardCeremony(id)
        toast.success('어워드를 삭제했습니다')
        setOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : '삭제 실패')
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          <Trash2 className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">삭제</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>어워드를 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{title}&rdquo; 어워드를 영구적으로 삭제합니다. 이 작업은
            되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isPending ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
