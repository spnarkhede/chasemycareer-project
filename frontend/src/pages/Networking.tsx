import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoProtection } from '@/hooks/useDemoProtection';
import { getNetworkingContacts, createNetworkingContact, updateNetworkingContact, deleteNetworkingContact } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Plus, Mail, Phone, Linkedin, Building2, Edit, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { NetworkingContact } from '@/types';

export default function Networking() {
  const { user } = useAuth();
  const { checkDemoMode } = useDemoProtection();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<NetworkingContact[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<NetworkingContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    linkedin_url: '',
    phone: '',
    notes: '',
    relationship_strength: 3,
  });

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getNetworkingContacts(user.id);
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (checkDemoMode(editingContact ? 'update contacts' : 'add contacts')) return;

    try {
      if (editingContact) {
        await updateNetworkingContact(editingContact.id, formData);
        toast.success('Contact updated successfully');
      } else {
        await createNetworkingContact({ ...formData, user_id: user.id });
        toast.success('Contact added successfully');
      }

      await loadContacts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    }
  };

  const handleDelete = async (id: string) => {
    if (checkDemoMode('delete contacts')) return;
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await deleteNetworkingContact(id);
      toast.success('Contact deleted');
      await loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleEdit = (contact: NetworkingContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      company: contact.company || '',
      position: contact.position || '',
      email: contact.email || '',
      linkedin_url: contact.linkedin_url || '',
      phone: contact.phone || '',
      notes: contact.notes || '',
      relationship_strength: contact.relationship_strength || 3,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingContact(null);
    setFormData({
      name: '',
      company: '',
      position: '',
      email: '',
      linkedin_url: '',
      phone: '',
      notes: '',
      relationship_strength: 3,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64 bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Professional Network
          </h1>
          <p className="text-muted-foreground mt-1">
            Build and maintain your professional connections
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContact(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
              <DialogDescription>
                {editingContact ? 'Update contact information' : 'Add a new professional contact'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456 7890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship_strength">Relationship Strength (1-5)</Label>
                <Input
                  id="relationship_strength"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.relationship_strength}
                  onChange={(e) => setFormData({ ...formData, relationship_strength: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How you met, conversation topics, follow-up items..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No contacts yet</p>
            <p className="text-muted-foreground mb-4">Start building your professional network</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{contact.name}</CardTitle>
                    <CardDescription className="truncate">
                      {contact.position && contact.company
                        ? `${contact.position} at ${contact.company}`
                        : contact.position || contact.company || 'Professional Contact'}
                    </CardDescription>
                  </div>
                  {contact.relationship_strength && (
                    <div className="flex items-center gap-1">
                      {[...Array(contact.relationship_strength)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:text-primary truncate">
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.linkedin_url && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Linkedin className="h-4 w-4" />
                    <a
                      href={contact.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary truncate"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {contact.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {contact.notes}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
