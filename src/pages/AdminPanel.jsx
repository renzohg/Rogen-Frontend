import { useState, useEffect } from 'react';
import {
  loginAdmin,
  getAutosAdmin,
  createAuto,
  updateAuto,
  deleteAuto
} from '../services/api';
import Modal from '../components/Modal';
import { LockIcon, RefreshIcon, EditIcon, TrashIcon, StarFillIcon, SearchIcon, ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';
import './AdminPanel.css';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autos, setAutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAuto, setEditingAuto] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('todos'); // 'todos', 'disponibles', 'destacados'
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    precio: '',
    kilometraje: '',
    combustible: 'Nafta',
    transmision: 'Manual',
    color: '',
    descripcion: '',
    imagenes: '',
    estado: 'Disponible',
    publicado: true,
    destacado: false,
    nuevoIngreso: false,
    version: '',
    moneda: 'ARS',
    // Nuevos campos opcionales
    puertas: '',
    motor: '',
    tipoCarroceria: '',
    llantasAleacion: false,
    tapizadoCuero: false,
    computadoraAbordo: false,
    portaVasos: false,
    direccion: '',
    alarma: false,
    controlTraccion: false,
    capacidadPersonas: '',
    potencia: '',
    distanciaEjes: '',
    capacidadTanque: '',
    valvulasPorCilindro: '',
    frenosABS: false,
    airbagConductorPasajero: false,
    largo: '',
    altura: '',
    ancho: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });


  // Estado para las estadísticas
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    destacados: 0,
    reservados: 0,
    vendidos: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      cargarAutos();
    }
  }, []);

  const showModal = (title, message, type = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '', type: 'info' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await loginAdmin(loginData.username, loginData.password);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      cargarAutos();
    } catch (error) {
      showModal('Error', 'Error al iniciar sesión: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAutos([]);
  };

  const cargarAutos = async () => {
    try {
      setLoading(true);
      const response = await getAutosAdmin();
      const autosData = response.data;
      setAutos(autosData);

      // Calcular estadísticas
      const total = autosData.length;
      const disponibles = autosData.filter(auto => auto.estado === 'Disponible').length;
      const destacados = autosData.filter(auto => auto.destacado).length;
      const reservados = autosData.filter(auto => auto.estado === 'Reservado').length;
      const vendidos = autosData.filter(auto => auto.estado === 'Vendido').length;

      setStats({ total, disponibles, destacados, reservados, vendidos });
    } catch (error) {
      console.error('Error al cargar autos:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // NOTA: Necesitas obtener tu propia clave API gratuita en https://api.imgbb.com/
    // Reemplaza la clave de ejemplo con tu clave real
    const apiKey = '6673449535d4618aa72a22cf638256dc'; // Clave de ejemplo - reemplazar con tu clave
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Error al subir imagen');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);
      const uploadedUrls = await Promise.all(
        files.map(file => uploadImageToImgBB(file))
      );

      // Combinar URLs existentes con las nuevas
      const existingUrls = formData.imagenes ? formData.imagenes.split(',').map(url => url.trim()).filter(url => url) : [];
      const allUrls = [...existingUrls, ...uploadedUrls].join(', ');
      setFormData({ ...formData, imagenes: allUrls });
      setImageFiles([]);
      showModal('Éxito', `${uploadedUrls.length} imagen(es) subida(s) exitosamente`, 'success');
    } catch (error) {
      showModal('Error', 'Error al subir imágenes: ' + error.message, 'error');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const autoData = {
        ...formData,
        año: parseInt(formData.año),
        precio: parseFloat(formData.precio),
        kilometraje: parseFloat(formData.kilometraje),
        imagenes: formData.imagenes ? formData.imagenes.split(',').map(url => url.trim()).filter(url => url) : []
      };

      if (editingAuto) {
        await updateAuto(editingAuto._id, autoData);
        showModal('Éxito', 'Auto actualizado exitosamente', 'success');
      } else {
        await createAuto(autoData);
        showModal('Éxito', 'Auto creado exitosamente', 'success');
      }

      resetForm();
      cargarAutos();
    } catch (error) {
      showModal('Error', 'Error: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (auto) => {
    setEditingAuto(auto);
    setFormData({
      marca: auto.marca,
      modelo: auto.modelo,
      año: auto.año,
      precio: auto.precio,
      kilometraje: auto.kilometraje,
      combustible: auto.combustible,
      transmision: auto.transmision,
      color: auto.color,
      descripcion: auto.descripcion || '',
      imagenes: auto.imagenes ? auto.imagenes.join(', ') : '',
      estado: auto.estado,
      publicado: auto.publicado !== undefined ? auto.publicado : true,
      destacado: auto.destacado || false,
      nuevoIngreso: auto.nuevoIngreso || false,
      version: auto.version || '',
      moneda: auto.moneda || 'ARS',
      puertas: auto.puertas || '',
      motor: auto.motor || '',
      tipoCarroceria: auto.tipoCarroceria || '',
      llantasAleacion: auto.llantasAleacion || false,
      tapizadoCuero: auto.tapizadoCuero || false,
      computadoraAbordo: auto.computadoraAbordo || false,
      portaVasos: auto.portaVasos || false,
      direccion: auto.direccion || '',
      alarma: auto.alarma || false,
      controlTraccion: auto.controlTraccion || false,
      capacidadPersonas: auto.capacidadPersonas || '',
      potencia: auto.potencia || '',
      distanciaEjes: auto.distanciaEjes || '',
      capacidadTanque: auto.capacidadTanque || '',
      valvulasPorCilindro: auto.valvulasPorCilindro || '',
      frenosABS: auto.frenosABS || false,
      airbagConductorPasajero: auto.airbagConductorPasajero || false,
      largo: auto.largo || '',
      altura: auto.altura || '',
      ancho: auto.ancho || ''
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;

    try {
      setLoading(true);
      await deleteAuto(deleteConfirm.id);
      cargarAutos();
      showModal('Éxito', 'Auto eliminado exitosamente', 'success');
    } catch (error) {
      showModal('Error', 'Error al eliminar: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const handleStatusChange = async (auto, newStatus) => {
    try {
      setLoading(true);
      await updateAuto(auto._id, { ...auto, estado: newStatus });
      cargarAutos();
      showModal('Éxito', `Estado actualizado a: ${newStatus}`, 'success');
    } catch (error) {
      showModal('Error', 'Error al actualizar el estado: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (auto) => {
    try {
      setLoading(true);
      await updateAuto(auto._id, { ...auto, destacado: !auto.destacado });
      cargarAutos();
      showModal('Éxito', `Auto ${!auto.destacado ? 'marcado como destacado' : 'quitado de destacados'}`, 'success');
    } catch (error) {
      showModal('Error', 'Error al actualizar el estado destacado: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const togglePublicado = async (auto) => {
    try {
      setLoading(true);
      await updateAuto(auto._id, { ...auto, publicado: !auto.publicado });
      cargarAutos();
      showModal('Éxito', `Auto ${!auto.publicado ? 'publicado' : 'despublicado'}`, 'success');
    } catch (error) {
      showModal('Error', 'Error al actualizar el estado de publicación: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };


  // Pagination logic
  const filteredAutos = autos.filter(auto => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      auto.marca.toLowerCase().includes(search) ||
      auto.modelo.toLowerCase().includes(search) ||
      auto.año.toString().includes(search) ||
      auto.color.toLowerCase().includes(search)
    );

    // Aplicar filtro activo
    let matchesFilter = true;
    if (activeFilter === 'disponibles') {
      matchesFilter = auto.estado === 'Disponible';
    } else if (activeFilter === 'destacados') {
      matchesFilter = auto.destacado === true;
    } else if (activeFilter === 'reservados') {
      matchesFilter = auto.estado === 'Reservado';
    } else if (activeFilter === 'vendidos') {
      matchesFilter = auto.estado === 'Vendido';
    }
    // Si es 'todos', matchesFilter permanece true

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAutos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAutos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetForm = () => {
    setFormData({
      marca: '',
      modelo: '',
      año: new Date().getFullYear(),
      precio: '',
      kilometraje: '',
      combustible: 'Nafta',
      transmision: 'Manual',
      color: '',
      descripcion: '',
      imagenes: '',
      estado: 'Disponible',
      publicado: true,
      destacado: false,
      nuevoIngreso: false,
      version: '',
      moneda: 'ARS',
      puertas: '',
      motor: '',
      tipoCarroceria: '',
      llantasAleacion: false,
      tapizadoCuero: false,
      computadoraAbordo: false,
      portaVasos: false,
      direccion: '',
      alarma: false,
      controlTraccion: false,
      capacidadPersonas: '',
      potencia: '',
      distanciaEjes: '',
      capacidadTanque: '',
      valvulasPorCilindro: '',
      frenosABS: false,
      airbagConductorPasajero: false,
      largo: '',
      altura: '',
      ancho: ''
    });
    setImageFiles([]);
    setEditingAuto(null);
    setShowForm(false);
    setShowAdvancedFeatures(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="admin-login">
          <div className="login-container">
            <div className="login-icon">
              <LockIcon size={48} color="var(--color-primary)" />
            </div>
            <h1>Panel de Administración</h1>
            <h2>Rogen Autos</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />
      </>
    );
  }

  return (
    <>
      <div className="admin-panel">
        <header className="admin-header">
          <h1>Panel de Administración - Rogen Autos</h1>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </header>

        <div className="admin-container">
          <div className="admin-actions">
            <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
              + Nuevo Auto
            </button>
            <button onClick={cargarAutos} className="btn-secondary">
              <RefreshIcon size={20} />
              Actualizar
            </button>
            <a href="/" className="btn-view-page" target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon size={20} />
              Ver Página
            </a>
          </div>

          {showForm && (
            <div className="admin-form-container">
              <h2>{editingAuto ? 'Editar Auto' : 'Nuevo Auto'}</h2>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Marca *</label>
                    <input
                      type="text"
                      value={formData.marca}
                      onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Modelo *</label>
                    <input
                      type="text"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Año *</label>
                    <input
                      type="number"
                      value={formData.año}
                      onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Precio *</label>
                    <input
                      type="number"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      min="0"
                      step="0.01"
                      required
                    />
                    <div className="currency-checkboxes">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.moneda === 'ARS'}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, moneda: 'ARS' });
                            }
                          }}
                        />
                        ARS
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.moneda === 'USD'}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, moneda: 'USD' });
                            }
                          }}
                        />
                        USD
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Kilometraje *</label>
                    <input
                      type="number"
                      value={formData.kilometraje}
                      onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Color *</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Versión</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="Ej: 1.4 ALLURE"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Combustible *</label>
                    <select
                      value={formData.combustible}
                      onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
                      required
                    >
                      <option value="Nafta">Nafta</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Eléctrico">Eléctrico</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="GNC">GNC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Transmisión *</label>
                    <select
                      value={formData.transmision}
                      onChange={(e) => setFormData({ ...formData, transmision: e.target.value })}
                      required
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automática">Automática</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estado *</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      required
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Reservado">Reservado</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Imágenes</label>
                  <div className="image-upload-container">
                    <div className="image-upload-section">
                      <label className="upload-label">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                          style={{ display: 'none' }}
                        />
                        <span className="upload-button">
                          {uploadingImages ? 'Subiendo...' : '+ Subir Imágenes'}
                        </span>
                      </label>
                      <p className="upload-hint">O pega URLs separadas por comas</p>
                    </div>
                    <input
                      type="text"
                      value={formData.imagenes}
                      onChange={(e) => setFormData({ ...formData, imagenes: e.target.value })}
                      placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                      className="image-urls-input"
                    />
                    {formData.imagenes && (
                      <div className="image-preview-list">
                        {formData.imagenes.split(',').map((url, index) => {
                          const trimmedUrl = url.trim();
                          if (!trimmedUrl) return null;
                          return (
                            <div key={index} className="image-preview-item">
                              <img src={trimmedUrl} alt={`Preview ${index + 1}`} />
                              <button
                                type="button"
                                onClick={() => {
                                  const urls = formData.imagenes.split(',').map(u => u.trim()).filter((u, i) => i !== index);
                                  setFormData({ ...formData, imagenes: urls.join(', ') });
                                }}
                                className="remove-image-btn"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.publicado}
                      onChange={(e) => setFormData({ ...formData, publicado: e.target.checked })}
                    />
                    Publicado
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    />
                    <StarFillIcon size={16} color="var(--color-accent)" />
                    Destacado
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.nuevoIngreso}
                      onChange={(e) => setFormData({ ...formData, nuevoIngreso: e.target.checked })}
                    />
                    Nuevo ingreso
                  </label>
                </div>

                {/* Sección de Características Avanzadas */}
                <div className="advanced-features-accordion">
                  <button
                    type="button"
                    className="accordion-toggle"
                    onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  >
                    <span>Todas las características (opcional)</span>
                    {showAdvancedFeatures ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                  </button>

                  {showAdvancedFeatures && (
                    <div className="accordion-content">
                      {/* Características principales */}
                      <h4 className="accordion-subtitle">Características principales</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Puertas</label>
                          <input type="number" value={formData.puertas} onChange={(e) => setFormData({ ...formData, puertas: e.target.value })} placeholder="Ej: 4" />
                        </div>
                        <div className="form-group">
                          <label>Motor</label>
                          <input type="text" value={formData.motor} onChange={(e) => setFormData({ ...formData, motor: e.target.value })} placeholder="Ej: 1.6L" />
                        </div>
                        <div className="form-group">
                          <label>Tipo de Carrocería</label>
                          <input type="text" value={formData.tipoCarroceria} onChange={(e) => setFormData({ ...formData, tipoCarroceria: e.target.value })} placeholder="Ej: Sedán" />
                        </div>
                      </div>

                      {/* Exterior e Interior */}
                      <h4 className="accordion-subtitle">Exterior e Interior</h4>
                      <div className="form-group checkbox-group">
                        <label>
                          <input type="checkbox" checked={formData.llantasAleacion} onChange={(e) => setFormData({ ...formData, llantasAleacion: e.target.checked })} />
                          Llantas de aleación
                        </label>
                        <label>
                          <input type="checkbox" checked={formData.tapizadoCuero} onChange={(e) => setFormData({ ...formData, tapizadoCuero: e.target.checked })} />
                          Tapizado de cuero
                        </label>
                      </div>

                      {/* Confort y Conveniencia */}
                      <h4 className="accordion-subtitle">Confort y Conveniencia</h4>
                      <div className="form-group checkbox-group">
                        <label>
                          <input type="checkbox" checked={formData.computadoraAbordo} onChange={(e) => setFormData({ ...formData, computadoraAbordo: e.target.checked })} />
                          Computadora de abordo
                        </label>
                        <label>
                          <input type="checkbox" checked={formData.portaVasos} onChange={(e) => setFormData({ ...formData, portaVasos: e.target.checked })} />
                          Porta vasos
                        </label>
                      </div>

                      {/* Información General */}
                      <h4 className="accordion-subtitle">Información General</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Dirección</label>
                          <input type="text" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} placeholder="Ej: Asistida" />
                        </div>
                        <div className="form-group checkbox-group" style={{ marginTop: '30px' }}>
                          <label>
                            <input type="checkbox" checked={formData.alarma} onChange={(e) => setFormData({ ...formData, alarma: e.target.checked })} />
                            Alarma
                          </label>
                        </div>
                      </div>

                      {/* Rendimiento y Dimensiones */}
                      <h4 className="accordion-subtitle">Rendimiento</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Potencia</label>
                          <input type="text" value={formData.potencia} onChange={(e) => setFormData({ ...formData, potencia: e.target.value })} placeholder="Ej: 110 hp" />
                        </div>
                        <div className="form-group">
                          <label>Capacidad Personas</label>
                          <input type="number" value={formData.capacidadPersonas} onChange={(e) => setFormData({ ...formData, capacidadPersonas: e.target.value })} placeholder="Ej: 5" />
                        </div>
                        <div className="form-group">
                          <label>Capacidad Tanque</label>
                          <input type="text" value={formData.capacidadTanque} onChange={(e) => setFormData({ ...formData, capacidadTanque: e.target.value })} placeholder="Ej: 50L" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Distancia entre ejes</label>
                          <input type="text" value={formData.distanciaEjes} onChange={(e) => setFormData({ ...formData, distanciaEjes: e.target.value })} placeholder="Ej: 2600 mm" />
                        </div>
                        <div className="form-group">
                          <label>Válvulas por cilindro</label>
                          <input type="number" value={formData.valvulasPorCilindro} onChange={(e) => setFormData({ ...formData, valvulasPorCilindro: e.target.value })} placeholder="Ej: 4" />
                        </div>
                        <div className="form-group checkbox-group" style={{ marginTop: '30px' }}>
                          <label>
                            <input type="checkbox" checked={formData.controlTraccion} onChange={(e) => setFormData({ ...formData, controlTraccion: e.target.checked })} />
                            Control de tracción
                          </label>
                        </div>
                      </div>

                      {/* Seguridad */}
                      <h4 className="accordion-subtitle">Seguridad</h4>
                      <div className="form-group checkbox-group">
                        <label>
                          <input type="checkbox" checked={formData.frenosABS} onChange={(e) => setFormData({ ...formData, frenosABS: e.target.checked })} />
                          Frenos ABS
                        </label>
                        <label>
                          <input type="checkbox" checked={formData.airbagConductorPasajero} onChange={(e) => setFormData({ ...formData, airbagConductorPasajero: e.target.checked })} />
                          Airbag conductor y pasajero
                        </label>
                      </div>

                      {/* Dimensiones */}
                      <h4 className="accordion-subtitle">Dimensiones</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Largo</label>
                          <input type="text" value={formData.largo} onChange={(e) => setFormData({ ...formData, largo: e.target.value })} placeholder="Ej: 4500 mm" />
                        </div>
                        <div className="form-group">
                          <label>Altura</label>
                          <input type="text" value={formData.altura} onChange={(e) => setFormData({ ...formData, altura: e.target.value })} placeholder="Ej: 1500 mm" />
                        </div>
                        <div className="form-group">
                          <label>Ancho</label>
                          <input type="text" value={formData.ancho} onChange={(e) => setFormData({ ...formData, ancho: e.target.value })} placeholder="Ej: 1800 mm" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Guardando...' : editingAuto ? 'Actualizar' : 'Crear'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-autos-list">
            <div className="admin-list-header">
              <div className="header-stats">
                <button
                  className={`filter-btn ${activeFilter === 'todos' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('todos');
                    setCurrentPage(1);
                  }}
                >
                  Todos ({stats.total})
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'disponibles' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('disponibles');
                    setCurrentPage(1);
                  }}
                >
                  Disponibles ({stats.disponibles})
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'destacados' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('destacados');
                    setCurrentPage(1);
                  }}
                >
                  Destacados ({stats.destacados})
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'reservados' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('reservados');
                    setCurrentPage(1);
                  }}
                >
                  Reservados ({stats.reservados})
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'vendidos' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('vendidos');
                    setCurrentPage(1);
                  }}
                >
                  Vendidos ({stats.vendidos})
                </button>
              </div>
              <div className="admin-search">
                <div className="search-wrapper">
                  <SearchIcon size={20} color="var(--color-text-light)" className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar por marca, modelo, año..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>
            {autos.length === 0 ? (
              <div className="no-autos">No hay autos registrados</div>
            ) : (() => {
              return filteredAutos.length === 0 ? (
                <div className="no-autos">No se encontraron autos con la búsqueda "{searchTerm}"</div>
              ) : (
                <div className="autos-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Año</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Publicado</th>
                        <th>Destacado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map(auto => (
                        <tr key={auto._id}>
                          <td>
                            {auto.imagenes && auto.imagenes.length > 0 ? (
                              <img
                                src={auto.imagenes[0]}
                                alt={`${auto.marca} ${auto.modelo} - Miniatura`}
                                className="auto-thumbnail"
                                loading="lazy"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="no-image-placeholder">Sin imagen</div>
                            )}
                          </td>
                          <td>{auto.marca}</td>
                          <td>{auto.modelo}</td>
                          <td>{auto.año}</td>
                          <td>{auto.moneda || 'ARS'} ${new Intl.NumberFormat('es-AR').format(auto.precio)}</td>
                          <td>
                            <select
                              value={auto.estado}
                              onChange={(e) => handleStatusChange(auto, e.target.value)}
                              className={`status-select status-${auto.estado.toLowerCase()}`}
                              disabled={loading}
                              title="Seleccionar estado"
                            >
                              <option value="Disponible" className="option-disponible">Disponible</option>
                              <option value="Reservado" className="option-reservado">Reservado</option>
                              <option value="Vendido" className="option-vendido">Vendido</option>
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() => togglePublicado(auto)}
                              className={`published-btn ${auto.publicado ? 'published' : 'unpublished'}`}
                              title={auto.publicado ? 'Despublicar auto' : 'Publicar auto'}
                              disabled={loading}
                            >
                              {auto.publicado ? '✓' : '✗'}
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => toggleFeatured(auto)}
                              className={`featured-btn ${auto.destacado ? 'featured' : ''}`}
                              title={auto.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                              disabled={loading}
                            >
                              {auto.destacado ? (
                                <StarFillIcon size={20} color="var(--color-accent)" />
                              ) : (
                                <StarFillIcon size={20} color="var(--color-text-light)" />
                              )}
                            </button>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button onClick={() => handleEdit(auto)} className="btn-edit" title="Editar">
                                <EditIcon size={16} />
                              </button>
                              <button onClick={() => handleDeleteClick(auto._id)} className="btn-delete" title="Eliminar">
                                <TrashIcon size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className="pagination-arrow"
                      >
                        &laquo;
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show first page, last page, and pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className="pagination-arrow"
                      >
                        &raquo;
                      </button>
                      <span className="pagination-info">
                        Página {currentPage} de {totalPages} ({filteredAutos.length} autos)
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        title="Confirmar Eliminación"
        message="¿Estás seguro de eliminar este auto? Esta acción no se puede deshacer."
        type="confirm"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

export default AdminPanel;
