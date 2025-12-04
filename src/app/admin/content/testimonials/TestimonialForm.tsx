
"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import type { Testimonial } from "./page"

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama harus memiliki setidaknya 2 karakter." }),
  title: z.string().min(3, { message: "Jabatan/Peran harus memiliki setidaknya 3 karakter." }),
  quote: z.string().min(10, { message: "Kutipan harus memiliki setidaknya 10 karakter." }),
  imageUrl: z.string().url({ message: "URL gambar tidak valid." }),
})

interface TestimonialFormProps {
  testimonial: Testimonial | null;
  onSave: () => void;
}

export function TestimonialForm({ testimonial, onSave }: TestimonialFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const firestore = useFirestore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: testimonial || {
      name: "",
      title: "",
      quote: "",
      imageUrl: "https://picsum.photos/seed/testimonial/100",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!firestore) return

      try {
        if (testimonial?.id) {
          const docRef = doc(firestore, "testimonials", testimonial.id)
          await setDocumentNonBlocking(docRef, values, { merge: true })
          toast({ title: "Berhasil", description: "Testimoni berhasil diperbarui." })
        } else {
          const colRef = collection(firestore, "testimonials")
          await addDocumentNonBlocking(colRef, values)
          toast({ title: "Berhasil", description: "Testimoni baru telah ditambahkan." })
        }
        onSave()
      } catch (error) {
        console.error("Error saving testimonial:", error)
        toast({
          variant: "destructive",
          title: "Gagal Menyimpan",
          description: "Terjadi kesalahan. Silakan coba lagi.",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="cth. John Doe" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jabatan / Peran</FormLabel>
              <FormControl>
                <Input placeholder="cth. Alumni, Orang Tua Siswa" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kutipan Testimoni</FormLabel>
              <FormControl>
                <Textarea placeholder="Tulis kutipan testimoni di sini..." {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Gambar</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
        </Button>
      </form>
    </Form>
  )
}
