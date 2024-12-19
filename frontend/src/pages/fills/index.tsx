import axios from "axios";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/modal/confirmModal/index.tsx";
import DeleteConfirmModal from "../../components/modal/deleteModal/index.tsx";
import { Field, Fill, ApiError, PaginationData } from "../../types";

const FillsPage: React.FC = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [fills, setFills] = useState<Fill[]>([]);
  const [form, setForm] = useState<{
    fieldId: string;
    value: string | number | boolean | Date | "";
    isRequired: boolean;
  }>({
    fieldId: "",
    value: "",
    isRequired: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedFill, setSelectedFill] = useState<Fill | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const itemsPerPage = 5;

  //Função para buscar os Campos no endpoint do backend para listar no dropdown de campos
  const fetchFields = async () => {
    try {
      setLoading(true);
      const allFields: Field[] = [];
      let currentPage = 1;
      let totalPages = 1;
  
      do {
        const response = await axios.get(`http://localhost:3001/fields?page=${currentPage}`);
        allFields.push(...response.data.data); // Adiciona os itens da página atual
        totalPages = response.data.pagination.totalPages; // Atualiza o número total de páginas
        currentPage++; // Incrementa para buscar a próxima página
      } while (currentPage <= totalPages);
  
      setFields(allFields);
    } catch (error) {
      const apiError = error as { response?: { data: ApiError } };
      setError(apiError.response?.data.error || "Erro ao carregar campos");
      console.error("Erro detalhado ao carregar campos:", error);
    } finally {
      setLoading(false);
    }
  };

  //Função para buscar os Preenchimentos no endpoint do backend
  const fetchFills = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/fills?page=${page}&limit=${itemsPerPage}`
      );
      setFills(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        page: page,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      const apiError = error as { response?: { data: ApiError } };
      setError(
        apiError.response?.data.error || "Erro ao carregar preenchimentos"
      );
      console.error("Erro detalhado ao carregar preenchimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  //Função para editar um preenchimento
  const handleEdit = async (fillData: Partial<Fill>) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:3001/fills/${selectedFill?.id}`,
        fillData
      );
      await fetchFills();
      setIsEditModalOpen(false);
      setSelectedFill(null);
      setSuccessMessage("Preenchimento editado com sucesso!");
      // Remove a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Erro ao editar preenchimento");
      } else {
        setError("Erro desconhecido ao editar preenchimento");
      }
      // Remove a mensagem de erro após 3 segundos
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  //Função para deletar um preenchimento
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/fills/${selectedFill?.id}`);
      await fetchFills();
      setIsDeleteModalOpen(false);
      setSelectedField(null);
      setSuccessMessage("Preenchimento excluído com sucesso!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message ||
                            "Erro ao excluir preenchimento";
        const details = error.response?.data?.details;
        setError(details ? `${errorMessage}. ${details}` : errorMessage);
      } else {
        setError("Erro desconhecido ao excluir preenchimento");
      }
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  //Função para alterar o Campo selecionado no dropdown
  const handleFieldSelection = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    setSelectedField(field || null);
    setForm((prev) => ({ ...prev, fieldId, value: "" }));
  };

  //Função para renderizar de forma dinamica o Input baseado no tipo requerido no Campo 
  const renderValueInput = () => {
    if (!selectedField) return null;

    switch (selectedField.datatype) {
      case "string":
        return (
          <input
            type="text"
            value={form.value as string}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder="Digite o texto"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={form.value !== "" ? form.value.toString() : ""}
            onChange={(e) =>
              setForm({
                ...form,
                value: e.target.value ? Number(e.target.value) : "",
              })
            }
            placeholder="Digite um número"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        );
      case "boolean":
        return (
          <select
            value={form.value.toString()}
            onChange={(e) =>
              setForm({ ...form, value: e.target.value === "true" })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          >
            <option value="" disabled>
              Selecione um valor
            </option>
            <option value="true">Verdadeiro</option>
            <option value="false">Falso</option>
          </select>
        );
      case "date":
        return (
          <input
            type="date"
            value={form.value !== "" ? form.value.toString() : ""}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        );
      default:
        return null;
    }
  };

  //Função para enviar o formulário para o backend e salvar o novo Preenchimento
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<Fill>("http://localhost:3001/fills", {
        fieldId: form.fieldId,
        value: form.value,
        isRequired: form.isRequired,
      });

      await fetchFills(1); // Recarrega a primeira página
      setForm({ fieldId: "", value: "", isRequired: false });
      setSelectedField(null);
      setSuccessMessage("Preenchimento criado com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      const apiError = error as { response?: { data: ApiError } | Error };
      const errorMessage =
        (apiError as { response?: { data: ApiError } }).response?.data.error ||
        (error as Error).message ||
        "Erro ao criar preenchimento";
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
      console.error("Erro ao criar preenchimento:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
    fetchFills();
  }, []);

  const handleNavigateToFields = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciamento de Preenchimentos
        </h1>
        <button
          onClick={handleNavigateToFields}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50"
        >
          <span>Ir para Campos</span>
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
        <div className="space-y-2">
          <label
            htmlFor="fieldId"
            className="block text-sm font-medium text-gray-700"
          >
            Campo
          </label>
          <select
            id="fieldId"
            value={form.fieldId}
            onChange={(e) => handleFieldSelection(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          >
            <option value="" disabled>
              Selecione um campo
            </option>
            {fields!.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name} ({field.datatype})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="value"
            className="block text-sm font-medium text-gray-700"
          >
            Valor
          </label>
          {selectedField ? (
            renderValueInput()
          ) : (
            <input
              type="text"
              disabled
              placeholder="Selecione um campo primeiro"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
            />
          )}
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
          disabled={loading || !selectedField}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Adicionar Preenchimento"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Preenchimentos Criados
        </h2>
        {fills.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-4">
            Nenhum preenchimento criado ainda. Crie seu primeiro preenchimento!
          </div>
        ) : (
          <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campo
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
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
                {fills.map((fill) => (
                  <tr key={fill.id} className="hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap">
                      {fields.find((field) => field.id === fill.fieldId)?.name}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {(() => {
                        if (typeof fill.value === "number") {
                          return fill.value;
                        }
                        if (typeof fill.value === "boolean") {
                          return fill.value ? "Sim" : "Não";
                        }
                        if (typeof fill.value === "string") {
                          return fill.value;
                        }
                        if (fill.value instanceof Date) {
                          return fill.value.toLocaleDateString();
                        }
                        return "";
                      })()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(fill.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {fill.isRequired ? "Sim" : "Não"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedFill(fill);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFill(fill);
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
                  onClick={() => fetchFills(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchFills(pagination.page + 1)}
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
          setSelectedFill(null);
        }}
        onSave={handleEdit}
        item={selectedFill}
        mode={"fill"}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFill(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o campo "${selectedFill?.value}"?`}
      />
    </div>
  );
};

export default FillsPage;
