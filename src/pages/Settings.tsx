import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Building2,
  Users,
  Shield,
  Bell,
  Database,
  Mail,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

const settingsSections = [
  { icon: Building2, label: 'Información de la Firma', id: 'firm' },
  { icon: Users, label: 'Roles y Permisos', id: 'roles' },
  { icon: Shield, label: 'Seguridad', id: 'security' },
  { icon: Bell, label: 'Notificaciones', id: 'notifications' },
  { icon: Database, label: 'Respaldos', id: 'backups' },
  { icon: Mail, label: 'Correo Electrónico', id: 'email' },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('firm');

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente');
  };

  const handleEditRole = (role: string) => {
    toast.info(`Editando rol: ${role}`, { description: 'Funcionalidad disponible próximamente' });
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Configuración</h1>
        <p className="mt-1 text-muted-foreground">Administración del sistema y preferencias</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="stat-card">
            <nav className="space-y-1">
              {settingsSections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Firm Information */}
          <div className="stat-card">
            <div className="mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground">Información de la Firma</h3>
              <p className="text-sm text-muted-foreground">Datos generales de la organización</p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firmName">Nombre de la Firma</Label>
                  <Input id="firmName" defaultValue="Prueba" placeholder="Nombre de la firma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input id="rfc" defaultValue="ENT210315AB1" placeholder="RFC de la firma" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" defaultValue="Av. Paseo de la Reforma 250, Piso 15, CDMX" placeholder="Dirección completa" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue="+52 55 1234 5678" placeholder="Teléfono principal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" defaultValue="contacto@prueba.com" placeholder="Correo de contacto" />
                </div>
              </div>
            </div>
          </div>

          {/* Commission Settings */}
          <div className="stat-card">
            <div className="mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground">Configuración de Comisiones</h3>
              <p className="text-sm text-muted-foreground">Reglas generales para el cálculo de comisiones</p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultCommission">Comisión por Defecto (%)</Label>
                  <Input id="defaultCommission" type="number" defaultValue="15" placeholder="Porcentaje" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentPeriod">Período de Pago</Label>
                  <Input id="paymentPeriod" defaultValue="Quincenal" placeholder="Período" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">Cálculo automático de comisiones</p>
                  <p className="text-sm text-muted-foreground">Calcular comisiones al cerrar un caso</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">Notificar comisiones pendientes</p>
                  <p className="text-sm text-muted-foreground">Enviar recordatorios de pagos pendientes</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Roles Overview */}
          <div className="stat-card">
            <div className="mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground">Roles del Sistema</h3>
              <p className="text-sm text-muted-foreground">Perfiles de acceso disponibles</p>
            </div>
            <div className="space-y-3">
              {[
                { role: 'Administrador / Socio', description: 'Acceso completo al sistema', color: 'bg-accent/10 text-accent' },
                { role: 'Abogado', description: 'Gestión de casos asignados y comisiones propias', color: 'bg-primary/10 text-primary' },
                { role: 'Ventas / Recepción', description: 'Registro de clientes y casos nuevos', color: 'bg-success/10 text-success' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>{item.role}</span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditRole(item.role)}>Editar</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="btn-gold gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
