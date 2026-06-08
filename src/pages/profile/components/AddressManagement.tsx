import React from 'react';
import AddressComponent from '@/components/dynamicAddress/AddressComponent';

interface AddressManagementProps {
  mode?: 'list' | 'create';
}

const AddressManagement: React.FC<AddressManagementProps> = ({ mode = 'list' }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">آدرس‌های من</h2>
          <p className="text-sm sm:text-base text-gray-600">مدیریت و ویرایش آدرس‌های ثبت شده</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3 sm:p-4 md:p-6">
        <AddressComponent
          multiSelect={false}
          onSelect={() => {}}
          defaultSelectedId={null}
          showActions={true}
          showSelection={false}
          title="آدرس‌های من"
        />
      </div>
    </div>
  );
};

export default AddressManagement;


