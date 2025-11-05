import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Calendar, Trophy, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { data: editions } = trpc.admin.editions.getAll.useQuery();
  const currentEdition = editions?.[0];

  const { data: stats } = trpc.admin.registrations.getStats.useQuery(
    { editionId: currentEdition?.id || 0 },
    { enabled: !!currentEdition }
  );

  const { data: registrations } = trpc.admin.registrations.getByEdition.useQuery(
    { editionId: currentEdition?.id || 0 },
    { enabled: !!currentEdition }
  );

  const totalRevenue = registrations?.reduce((sum, reg) => sum + (reg.amountPaidInCents || 0), 0) || 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of the current race edition
          </p>
        </div>

        {currentEdition ? (
          <>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Registrations
                  </CardTitle>
                  <Users className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.total || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Paid Registrations
                  </CardTitle>
                  <Trophy className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats?.paid || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Pending Payments
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats?.pending || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    €{(totalRevenue / 100).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Edition</CardTitle>
                <CardDescription>
                  {currentEdition.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-medium">
                      {new Date(currentEdition.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-medium capitalize">{currentEdition.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium">{currentEdition.location || "Not specified"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Registration</div>
                    <div className="font-medium">
                      {currentEdition.registrationOpen ? "Open" : "Closed"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {registrations && registrations.length > 0 ? (
                  <div className="space-y-4">
                    {registrations.slice(0, 5).map((reg) => (
                      <div key={reg.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <div className="font-medium">{reg.fullName}</div>
                          <div className="text-sm text-gray-600">{reg.email}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            reg.paymentStatus === 'completed' ? 'text-green-600' : 
                            reg.paymentStatus === 'pending' ? 'text-orange-600' : 
                            'text-red-600'
                          }`}>
                            {reg.paymentStatus}
                          </div>
                          <div className="text-xs text-gray-500">
                            {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No registrations yet
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No race editions found. Create one to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

