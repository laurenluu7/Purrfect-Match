import React from 'react';
import { CatCard } from './CatCard';
import { Cat } from '../types';
import { Cat as CatIcon, Sparkles, ShieldAlert, CheckCircle2, Edit, Trash2, Eye, Cake } from 'lucide-react';
import { isTodayBirthday, triggerBirthdayConfetti } from '../utils/birthdayUtils';

interface CatGridProps {
  cats: Cat[];
  viewMode: 'grid' | 'table';
  onSelectCat: (cat: Cat) => void;
  onEditCat: (cat: Cat) => void;
  onDeleteCat: (id: string) => void;
  onToggleFeature: (id: string) => void;
  onAddNew: () => void;
  onOpenBirthdayParty?: (cat: Cat) => void;
}

export const CatGrid: React.FC<CatGridProps> = ({
  cats,
  viewMode,
  onSelectCat,
  onEditCat,
  onDeleteCat,
  onToggleFeature,
  onAddNew,
  onOpenBirthdayParty
}) => {
  if (cats.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center shadow-xs my-8 space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center mx-auto text-pink-500">
          <CatIcon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">No cats found</h3>
          <p className="text-xs text-slate-600 mt-1">
            Try adjusting your search terms or filter criteria to see available cafe cats.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-2xs transition-all"
        >
          + Add New Cat Profile
        </button>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="bg-white rounded-2xl border border-pink-100 shadow-2xs overflow-hidden my-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-pink-100 text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                <th className="py-3 px-4">Cat</th>
                <th className="py-3 px-4">Age & Gender</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Medical Record</th>
                <th className="py-3 px-4">Arrival Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
              {cats.map((cat) => (
                <tr key={cat.id} className="hover:bg-pink-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center space-x-1">
                          <span>{cat.name}</span>
                          {cat.featured && <span className="text-amber-500">★</span>}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate max-w-[150px]">
                          {cat.personalityTraits.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium">
                    {cat.ageYears}y {cat.ageMonths}m • {cat.gender}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                      {cat.category}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      cat.adoptionStatus === 'Available' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                      cat.adoptionStatus === 'Pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      cat.adoptionStatus === 'Adopted' ? 'bg-sky-100 text-sky-900 border-sky-300' : 'bg-purple-100 text-purple-900 border-purple-300'
                    }`}>
                      {cat.adoptionStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {cat.medicalConcerns.length > 0 ? (
                      <span className="inline-flex items-center space-x-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <ShieldAlert className="w-3 h-3 text-rose-500" />
                        <span>{cat.medicalConcerns[0]}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Vaccinated & Healthy</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-600">
                    {cat.arrivalDate}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onSelectCat(cat)}
                        className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditCat(cat)}
                        className="p-1.5 rounded-lg text-slate-700 hover:text-pink-600 hover:bg-pink-50"
                        title="Edit Profile"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCat(cat.id)}
                        className="p-1.5 rounded-lg text-slate-700 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      {cats.map((cat) => (
        <CatCard
          key={cat.id}
          cat={cat}
          onSelectCat={onSelectCat}
          onEditCat={onEditCat}
          onDeleteCat={onDeleteCat}
          onToggleFeature={onToggleFeature}
          onOpenBirthdayParty={onOpenBirthdayParty}
        />
      ))}
    </div>
  );
};
