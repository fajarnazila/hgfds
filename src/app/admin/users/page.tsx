
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
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase"
import { collection, query, doc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type UserRole = 'Admin' | 'User' | 'Super Admin';

type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  role: UserRole;
}

const roles: UserRole[] = ['Admin', 'User'];

export default function AdminUsersPage() {
  const firestore = useFirestore()
  const { toast } = useToast()
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "users")
    )
  }, [firestore])

  const { data: users, isLoading } = useCollection<User>(usersQuery)

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, "users", userId);
    try {
      await updateDocumentNonBlocking(userDocRef, { role: newRole });
      toast({
        title: "Peran Diperbarui",
        description: `Peran pengguna telah berhasil diubah menjadi ${newRole}.`,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Peran",
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengguna</CardTitle>
        <CardDescription>
          Daftar semua pengguna yang terdaftar di sistem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Memuat pengguna...</TableCell>
              </TableRow>
            )}
            {users && users.length > 0 ? users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-4">
                   <Avatar>
                        {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.displayName || 'No Name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={user.role === 'Admin' || user.role === 'Super Admin' ? 'default' : 'secondary'}>{user.role || 'User'}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {roles.map((role) => (
                          <DropdownMenuItem 
                            key={role}
                            disabled={user.role === role}
                            onSelect={() => handleRoleChange(user.id, role)}
                          >
                            Jadikan {role}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Tidak ada pengguna ditemukan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
