import Image from "next/image";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center space-y-8 animate-pulse">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-lg border-4 border-white">
          <Image
            src="/logos/THiNK_Logo_Updated-02(icon).jpg"
            alt="THiNK Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Accessing Business Listing</h1>
          <p className="text-sm text-gray-500">Securely loading your workspace...</p>
        </div>
      </div>
    </div>
  );
}
