import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Crown, User as UserIcon } from 'lucide-react';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (userData: { name: string; email: string; password: string; role: 'user' | 'admin' }) => void;
}

export const CreateUserModal = ({ open, onOpenChange, onUserCreated }: CreateUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    onUserCreated(formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal-content max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserPlus className="h-6 w-6 text-primary" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will be able to log in with these credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter full name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="search-magical"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address..."
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="search-magical"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter secure password..."
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="search-magical"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              User Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'user' | 'admin') => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="search-magical">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Regular User
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Administrator
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="hover-scale"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-magical"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};