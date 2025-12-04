
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: any;
}

export default function AdminMessagesPage() {
  const firestore = useFirestore()
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null)

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "contactMessages"),
      orderBy("submittedAt", "desc")
    )
  }, [firestore])

  const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery)

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Pesan Masuk</CardTitle>
        <CardDescription>
          Lihat semua pesan yang dikirim melalui formulir kontak website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengirim</TableHead>
              <TableHead>Subjek</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Memuat pesan...</TableCell>
              </TableRow>
            )}
            {messages && messages.length > 0 ? messages.map((msg) => (
              <TableRow key={msg.id} className="cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                <TableCell>
                    <div className="font-medium">{msg.name}</div>
                    <div className="text-sm text-muted-foreground">{msg.email}</div>
                </TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell>{msg.submittedAt ? format(new Date(msg.submittedAt.seconds * 1000), "yyyy-MM-dd HH:mm") : 'N/A'}</TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedMessage(msg)}>
                        Lihat
                    </Button>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Tidak ada pesan ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog open={!!selectedMessage} onOpenChange={(isOpen) => !isOpen && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              Dari: {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 whitespace-pre-wrap text-sm text-muted-foreground">
            {selectedMessage?.message}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
