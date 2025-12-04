
"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase"
import { collection, query, doc } from "firebase/firestore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { TestimonialForm } from "./TestimonialForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
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
} from "@/components/ui/alert-dialog"

export type Testimonial = {
  id?: string;
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
}

export default function TestimonialsTab() {
  const firestore = useFirestore()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<Testimonial | null>(null)

  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "testimonials"))
  }, [firestore])

  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery)

  const handleAdd = () => {
    setSelectedTestimonial(null)
    setIsFormOpen(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsFormOpen(true)
  }

  const handleDelete = async (testimonialId: string) => {
    if (!firestore) return
    const docRef = doc(firestore, "testimonials", testimonialId)
    await deleteDocumentNonBlocking(docRef)
    toast({ title: "Testimoni Dihapus", description: "Testimoni telah berhasil dihapus." })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Testimoni
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Kutipan</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            )}
            {testimonials && testimonials.length > 0 ? testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell>{testimonial.title}</TableCell>
                <TableCell className="max-w-xs truncate">{testimonial.quote}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(testimonial)}>Edit</DropdownMenuItem>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Hapus</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Tindakan ini tidak dapat diurungkan. Ini akan menghapus testimoni secara permanen.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => testimonial.id && handleDelete(testimonial.id)}>Lanjutkan</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
               <TableRow>
                <TableCell colSpan={4} className="text-center">Belum ada testimoni.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedTestimonial ? "Edit Testimoni" : "Tambah Testimoni Baru"}</DialogTitle>
            <DialogDescription>
              {selectedTestimonial ? "Ubah detail testimoni." : "Isi detail untuk testimoni baru."}
            </DialogDescription>
          </DialogHeader>
          <TestimonialForm testimonial={selectedTestimonial} onSave={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
