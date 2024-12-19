import ConfirmModal from "../../components/modal/confirmModal/index.tsx";
import DeleteConfirmModal from "../../components/modal/deleteModal/index.tsx";
import axios from "axios";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Field, PaginationData } from "../../types/index.ts";

const FieldsPage = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [form, setForm] = useState({
    name: "",
    datatype: "string" as "string" | "number" | "boolean" | "date",
    isRequired: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const itemsPerPage = 5;

  //Função para buscar os Campos no endpoint do backend
  const fetchFields = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/fields?page=${page}&limit=${itemsPerPage}`
      );
      setFields(response.data.data);
      console.log(fields);
      setPagination({
        total: response.data.pagination.total,
        page: page,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Erro ao carregar campos. Tente novamente."
        );
      } else {
        setError("Erro desconhecido ao carregar campos.");
      }
    } finally {
      setLoading(false);
    }
  };

  //Função para editar um campo
  const handleEdit = async (fieldData: Partial<Field>) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:3001/fields/${selectedField?.id}`,
        fieldData
      );
      await fetchFields(pagination.page);
      setIsEditModalOpen(false);
      setSelectedField(null);
      setSuccessMessage("Campo editado com sucesso!");
      // Remove a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Erro ao editar campo");
      } else {
        setError("Erro desconhecido ao editar campo");
      }
      // Remove a mensagem de erro após 3 segundos
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  //Função para deletar um campo
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/fields/${selectedField?.id}`);
      await fetchFields(pagination.page);
      setIsDeleteModalOpen(false);
      setSelectedField(null);
      setSuccessMessage("Campo excluído com sucesso!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message ||
                            "Erro ao excluir campo";
        const details = error.response?.data?.details;
        setError(details ? `${errorMessage}. ${details}` : errorMessage);
      } else {
        setError("Erro desconhecido ao excluir campo");
      }
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  //Função para validar o formulário
  const validateForm = () => {
    if (form.name.trim().length < 2) {
      setError("Nome do campo deve ter pelo menos 2 caracteres.");
      return false;
    }
    return true;
  };

  //Função para enviar o formulário para o backend e salvar o novo Campo
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post("http://localhost:3001/fields", form);

      // Recarrega a primeira página após criar um novo campo
      await fetchFields(1);

      setForm({ name: "", datatype: "string", isRequired: false });
      setSuccessMessage("Campo criado com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao criar campo. Tente novamente."
        );
      } else {
        setError("Erro desconhecido ao criar campo.");
      }
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  //Função para redirecionar para página de preenchimentos
  const handleNavigateToFills = () => {
    navigate("/fills");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciamento de Campos
        </h1>
        <button
          onClick={handleNavigateToFills}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
        >
          <span>Ir para Preenchimentos</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:bg-red-200 transition-colors"
          >
            ×
          </button>
        </div>
      )}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:bg-green-200 transition-colors"
          >
            ×
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-md p-6 rounded-lg border"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome do Campo
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Digite o nome do campo"
              required
              minLength={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="datatype"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Dado
            </label>
            <select
              id="datatype"
              value={form.datatype}
              onChange={(e) =>
                setForm({
                  ...form,
                  datatype: e.target.value as
                    | "string"
                    | "number"
                    | "boolean"
                    | "date",
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="string">Texto</option>
              <option value="number">Número</option>
              <option value="boolean">Booleano</option>
              <option value="date">Data</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isRequired"
            type="checkbox"
            checked={form.isRequired}
            onChange={(e) => setForm({ ...form, isRequired: e.target.checked })}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="isRequired"
            className="text-sm font-medium text-gray-700"
          >
            Campo Obrigatório
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-indigo-600"
          } text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          {loading ? "Criando..." : "Criar Campo"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Campos Criados {loading && "(Carregando...)"}
        </h2>
        {fields.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-4">
            Nenhum campo criado ainda. Crie seu primeiro campo!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Dado
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Obrigatório
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((field) => (
                    <tr key={field.id} className="hover:bg-gray-50">
                      <td className="p-3 whitespace-nowrap">{field.name}</td>
                      <td className="p-3 whitespace-nowrap">
                        {field.datatype}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {new Date(field.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {field.isRequired ? "Sim" : "Não"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedField(field);
                              setIsEditModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setSelectedField(field);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Mostrando {fields.length} de {pagination.total} resultados
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchFields(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchFields(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedField(null);
        }}
        onSave={handleEdit}
        mode={"field"}
        item={selectedField}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedField(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o campo "${selectedField?.name}"?`}
      />
    </div>
  );
};

export default FieldsPage;
