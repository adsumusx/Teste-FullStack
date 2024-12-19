import React, { useState, useEffect } from "react";
import { Field, Fill, ConfirmModalProps, EditItem } from "../../../types";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
  mode,
}) => {
  const [form, setForm] = useState<EditItem>({});

  useEffect(() => {
    if (item) {
      setForm(item);
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "field" ? "Editar Campo" : "Editar Preenchimento"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "field" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  value={(form as Field).name || ""}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value } as Field)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Dado
                </label>
                <select
                  value={(form as Field).datatype || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      datatype: e.target.value as Field["datatype"],
                    } as Field)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                >
                  <option value="string">Texto</option>
                  <option value="number">Número</option>
                  <option value="boolean">Booleano</option>
                  <option value="date">Data</option>
                </select>
              </div>
            </>
          )}

          {mode === "fill" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor
                </label>
                <input
                  type="text"
                  value={(form as Fill).value?.toString() || ""}
                  onChange={(e) =>
                    setForm({ ...form, value: e.target.value } as Fill)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={form.isRequired || false}
              onChange={(e) =>
                setForm({ ...form, isRequired: e.target.checked } as EditItem)
              }
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Campo Obrigatório
            </label>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmModal;
