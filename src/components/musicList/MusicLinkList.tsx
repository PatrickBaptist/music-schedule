import React, { useCallback, useEffect, useRef, useState } from "react";
import useMusicLinksContext from "../../context/hooks/useMusicLinksContext";
import Button from "../buttons/Buttons";
import Loading from "../../assets/Loading.gif";
import {
  ContainerVd,
  ContentVd,
  ListContainer,
  MusicGroup,
  SelectContainer,
} from "./MusicLinkListStyle";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaEdit,
  FaEllipsisV,
  FaFileAlt,
  FaGripVertical,
  FaRegCommentDots,
  FaSpotify,
  FaTimes,
  FaTrashAlt,
  FaYoutube,
} from "react-icons/fa";
import { UserRole } from "../../types/UserRole";
import { MusicLink } from "../../services/MusicLinksService";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Video = {
  url: string;
};

interface SpecialSchedulesProps {
  canDelete: string[];
}

type GroupedMusic = Record<string, MusicLink[]>;

const worshipMoments = [
  "Momento de Louvor",
  "Dízimos e Ofertas",
  "Batismo",
  "Ceia",
  "Final do Culto",
  "Culto de Quinta",
];

const momentBackgrounds: Record<string, string> = {
  "Momento de Louvor":
    "linear-gradient(135deg, rgba(30, 59, 114, 0.644), rgb(57, 113, 209))",

  "Dízimos e Ofertas":
    "linear-gradient(135deg, rgba(19, 78, 94, 0.555), rgba(113, 178, 128, 0.5))",

  Batismo:
    "linear-gradient(135deg, rgba(0, 78, 146, 0.685), rgb(0, 4, 40))",

  Ceia:
    "linear-gradient(135deg, rgba(66, 39, 90, 0.979), rgba(115, 75, 109, 0.178))",

  "Final do Culto":
    "linear-gradient(135deg, rgba(35, 37, 38, 0.616), rgb(65, 67, 69))",

  "Culto de Quinta":
    "linear-gradient(135deg, rgba(92, 67, 36, 0.979), rgba(158, 122, 64, 0.288))",
};

const buildGroupedMusic = (links: MusicLink[]): GroupedMusic => {
  const grouped: GroupedMusic = {};

  worshipMoments.forEach((moment) => {
    grouped[moment] = links
      .filter((link) => link.worshipMoment === moment)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  return grouped;
};

const findContainer = (id: string, grouped: GroupedMusic): string | undefined => {
  if (worshipMoments.includes(id)) return id;

  return worshipMoments.find((moment) =>
    grouped[moment]?.some((item) => item.id === id)
  );
};

const moveMusicItem = (
  grouped: GroupedMusic,
  activeId: string,
  overId: string
): GroupedMusic => {
  const activeContainer = findContainer(activeId, grouped);
  const overContainer = findContainer(overId, grouped);

  if (!activeContainer || !overContainer) return grouped;

  if (activeContainer === overContainer) {
    const items = [...grouped[activeContainer]];
    const oldIndex = items.findIndex((item) => item.id === activeId);
    const newIndex = items.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return grouped;
    }

    return {
      ...grouped,
      [activeContainer]: arrayMove(items, oldIndex, newIndex),
    };
  }

  const activeItems = [...grouped[activeContainer]];
  const overItems = [...grouped[overContainer]];
  const activeIndex = activeItems.findIndex((item) => item.id === activeId);
  const overIndex = overItems.findIndex((item) => item.id === overId);

  if (activeIndex === -1) return grouped;

  const newIndex = overIndex >= 0 ? overIndex : overItems.length;
  const [movedItem] = activeItems.splice(activeIndex, 1);

  return {
    ...grouped,
    [activeContainer]: activeItems,
    [overContainer]: [
      ...overItems.slice(0, newIndex),
      { ...movedItem, worshipMoment: overContainer },
      ...overItems.slice(newIndex),
    ],
  };
};

const MusicLinkList: React.FC<SpecialSchedulesProps> = ({ canDelete }) => {
  const tons = [
    "C",
    "Cm",
    "C#",
    "C#m",
    "D",
    "Dm",
    "D#",
    "D#m",
    "E",
    "Em",
    "F",
    "Fm",
    "F#",
    "F#m",
    "G",
    "Gm",
    "G#",
    "G#m",
    "A",
    "Am",
    "A#",
    "A#m",
    "B",
    "Bm",
  ];

  const { musicLinks, fetchMusicLinks, removeMusicLink, updateMusicLink } =
    useMusicLinksContext();
  const [openVideo, setOpenVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [worshipMoment, setWorshipMoment] = useState("");
  const [link, setLink] = useState("");
  const [letter, setLetter] = useState("");
  const [spotify, setSpotify] = useState("");
  const [cifra, setCifra] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  const allowedRoles = [UserRole.Leader, UserRole.Minister, UserRole.Admin];
  const canDeleteMusic = canDelete.some(role => allowedRoles.includes(role as UserRole));
  const reorderRoles = [
    UserRole.Leader,
    UserRole.Minister,
    UserRole.Admin,
    UserRole.Vocal,
  ];
  const canReorder = canDelete.some((role) =>
    reorderRoles.includes(role as UserRole)
  );
  const [groupedMusic, setGroupedMusic] = useState<GroupedMusic>(() =>
    buildGroupedMusic([])
  );
  const groupedMusicRef = useRef<GroupedMusic>(groupedMusic);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [selectedDescription, setSelectedDescription] = useState<{
    description: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchMusicLink = async () => {
      try {
        await fetchMusicLinks();
      } catch (err) {
        console.error(err);
      }
    };

    fetchMusicLink();
  }, [fetchMusicLinks]);

  useEffect(() => {
    const nextGrouped = buildGroupedMusic(musicLinks);
    groupedMusicRef.current = nextGrouped;
    setGroupedMusic(nextGrouped);
  }, [musicLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const persistOrderChanges = useCallback(
    async (nextGrouped: GroupedMusic) => {
      const updates: { id: string; data: MusicLink }[] = [];

      worshipMoments.forEach((moment) => {
        nextGrouped[moment]?.forEach((item, index) => {
          const newOrder = index + 1;
          const original = musicLinks.find((music) => music.id === item.id);

          if (!original || !item.id) return;

          if (
            original.order !== newOrder ||
            original.worshipMoment !== moment
          ) {
            updates.push({
              id: item.id,
              data: {
                ...original,
                order: newOrder,
                worshipMoment: moment,
              },
            });
          }
        });
      });

      if (updates.length === 0) return;

      setIsSavingOrder(true);

      try {
        await Promise.all(
          updates.map(({ id, data }) => updateMusicLink(id, data))
        );
        toast.success("Ordem atualizada!");
      } catch (err: unknown) {
        setGroupedMusic(buildGroupedMusic(musicLinks));

        if (err instanceof Error) {
          toast.error("Sem premissão! " + err.message);
        } else {
          toast.error("Erro ao atualizar ordem");
        }
      } finally {
        setIsSavingOrder(false);
      }
    },
    [musicLinks, updateMusicLink]
  );

  const handleDragOver = (event: DragOverEvent) => {
    if (!canReorder || isSavingOrder) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setGroupedMusic((prev) => {
      const nextGrouped = moveMusicItem(prev, activeId, overId);

      if (nextGrouped !== prev) {
        groupedMusicRef.current = nextGrouped;
      }

      return nextGrouped;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!canReorder || isSavingOrder) return;

    const { over } = event;
    if (!over) return;

    await persistOrderChanges(groupedMusicRef.current);
  };

  const handleVideoClick = () => {
    setOpenVideo(false);
    setLoading(false);
  };

  const openLinkVideo = (videoUrl: Video) => {
    setCurrentVideo(videoUrl);
    setLoading(true);
    setOpenVideo(true);
  };

  const handleEditClick = (id: string) => {
    const musicLink = musicLinks.find((m) => m.id === id);

    if (!musicLink) {
      toast.error("Música não encontrada!");
      return;
    }

    setName(musicLink.name);
    setWorshipMoment(musicLink.worshipMoment);
    setLink(musicLink.link || "");
    setLetter(musicLink.letter || "");
    setSpotify(musicLink.spotify || "");
    setCifra(musicLink.cifra || "");
    setDescription(musicLink.description || "");
    setOrder(musicLink.order || 0);
    setEditIndex(musicLink.id!);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    setLoadingCards((prev) => ({ ...prev, [id]: true }));
    setIsEditing(false);
    setEditIndex(null);

    try {
      await removeMusicLink(id);
      toast.success("Link removido com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Sem premissão! " + err.message);
      } else {
        toast.error("Erro desconhecido ao remover");
      }
    } finally {
      setLoadingCards((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSaveEdit = async () => {
    if (editIndex) {
      setLoadingCards((prev) => ({ ...prev, [editIndex]: true }));
      const updatedLink = {
        name,
        worshipMoment,
        link,
        letter,
        spotify,
        cifra,
        description,
        order,
      };
      setIsEditing(false);

      try {
        await updateMusicLink(editIndex, updatedLink);
        toast.success("Link editado com sucesso!");
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error("Sem premissão! " + err.message);
        } else {
          toast.error("Erro desconhecido ao editar");
        }
      } finally {
        setLoadingCards((prev) => ({ ...prev, [editIndex]: false }));
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }
  };

  const handleCardClick = (description?: string, name?: string) => {
    if (name) {
      setSelectedDescription({
        description: description || "Sem instruções ou descrições.",
        name,
      });
    }
  };

  const closeModal = () => {
    setSelectedDescription(null);
  };

  const toggleButtons = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <ListContainer>
      <AnimatePresence>
        {musicLinks.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {worshipMoments.map((moment) => {
              const musicInMoment = groupedMusic[moment] || [];

              if (musicInMoment.length === 0) return null;

              return (
                <DroppableMusicGroup
                  key={moment}
                  moment={moment}
                  background={momentBackgrounds[moment]}
                >
                  <SortableContext
                    items={musicInMoment.map((music) => music.id!)}
                    strategy={verticalListSortingStrategy}
                  >
                    {musicInMoment.map((musicLink, index) => (
                      <SortableMusicCard
                        key={musicLink.id}
                        musicLink={musicLink}
                        orderDisplay={index + 1}
                        canReorder={canReorder && !isSavingOrder}
                        canDeleteMusic={canDeleteMusic}
                        loadingCards={loadingCards}
                        openMenuId={openMenuId}
                        toggleButtons={toggleButtons}
                        handleCardClick={handleCardClick}
                        openLinkVideo={openLinkVideo}
                        handleEditClick={handleEditClick}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                </DroppableMusicGroup>
              );
            })}
          </DndContext>
        ) : (
          <p>Nenhuma canção definida para esta semana</p>
        )}
        {isEditing && (
          <motion.div
            className="edit-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="edit-content">
              <div className="input-container">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da música"
                  onKeyDown={handleKeyPress}
                />
                <SelectContainer>
                  <label htmlFor="worshipMoment">
                    Momento do Louvor
                  </label>
                  <select
                    id="worshipMoment"
                    value={worshipMoment}
                    onChange={(e) =>
                      setWorshipMoment(e.target.value)
                    }
                    onKeyDown={handleKeyPress}
                  >
                    <option value="">Selecione o momento</option>
                    {worshipMoments.map((moment) => (
                      <option key={moment} value={moment}>
                        {moment}
                      </option>
                    ))}
                  </select>
                </SelectContainer>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Link da música"
                  onKeyDown={handleKeyPress}
                />
                <input
                  type="text"
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  placeholder="Link da letra"
                  onKeyDown={handleKeyPress}
                />
                <input
                  type="text"
                  value={spotify}
                  onChange={(e) => setSpotify(e.target.value)}
                  placeholder="Link do Spotify"
                  onKeyDown={handleKeyPress}
                />
                <label
                  htmlFor="cifra"
                  style={{
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Ordem da música
                </label>
                <input
                  type="text"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="Ordem da música"
                  onKeyDown={handleKeyPress}
                />

                <SelectContainer>
                  <label htmlFor="cifra">Tom da Música</label>
                  <select
                    id="cifra"
                    value={cifra}
                    onChange={(e) => setCifra(e.target.value)}
                  >
                    <option value="">Selecione o tom</option>
                    {tons.map((tom, index) => (
                      <option key={index} value={tom}>
                        {tom}
                      </option>
                    ))}
                  </select>
                </SelectContainer>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <label
                    htmlFor="description"
                    style={{ fontSize: 14, fontWeight: "bold" }}
                  >
                    Observações sobre a música
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Observações sobre como será a música"
                    rows={3}
                    style={{
                      width: "95%",
                      height: "150px",
                      marginTop: "8px",
                      marginBottom: "8px",
                      padding: "8px",
                      fontSize: "16px",
                      border: "1px solid #ccc",
                      resize: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={handleCancelEdit}
                    style={{ backgroundColor: "#9e9e9e" }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    style={{ backgroundColor: "#007BFF" }}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedDescription && (
          <motion.div
            className="description-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                Informações da "
                <strong>{selectedDescription.name}</strong>"
              </h3>
              <pre className="modal-text" style={{ color: "#000" }}>
                {selectedDescription.description}
              </pre>
              <button onClick={closeModal} className="close-btn">
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}

        {openVideo && currentVideo && (
          <ContainerVd onClick={handleVideoClick}>
            <ContentVd>
              {loading && (
                <div className="loading-screen">
                  <img
                    src={Loading}
                    alt="Loading"
                    style={{ width: "150px" }}
                  />
                </div>
              )}

              <iframe
                width="560"
                height="315"
                src={currentVideo.url}
                title="YouTube video player"
                style={{
                  border: "none",
                  display: loading ? "none" : "block",
                }}
                onLoad={() => setLoading(false)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </ContentVd>
          </ContainerVd>
        )}
      </AnimatePresence>
    </ListContainer>
  );
};

interface DroppableMusicGroupProps {
  moment: string;
  background: string;
  children: React.ReactNode;
}

const DroppableMusicGroup: React.FC<DroppableMusicGroupProps> = ({
  moment,
  background,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: moment });

  return (
    <MusicGroup ref={setNodeRef} $bg={background} $isOver={isOver}>
      <h4 style={{ color: "var(--color-text-strong2)", margin: "16px 0" }}>{moment}</h4>
      {children}
    </MusicGroup>
  );
};

interface SortableMusicCardProps {
  musicLink: MusicLink;
  orderDisplay: number;
  canReorder: boolean;
  canDeleteMusic: boolean;
  loadingCards: { [key: string]: boolean };
  openMenuId: string | null;
  toggleButtons: (id: string) => void;
  handleCardClick: (description?: string, name?: string) => void;
  openLinkVideo: (video: Video) => void;
  handleEditClick: (id: string) => void;
  handleDelete: (id: string) => void;
}

const SortableMusicCard: React.FC<SortableMusicCardProps> = ({
  musicLink,
  orderDisplay,
  canReorder,
  canDeleteMusic,
  loadingCards,
  openMenuId,
  toggleButtons,
  handleCardClick,
  openLinkVideo,
  handleEditClick,
  handleDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: musicLink.id!,
    disabled: !canReorder,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`container-list${isDragging ? " is-dragging" : ""}`}
    >
      <div className="container-card">
        {canReorder && (
          <button
            type="button"
            className="drag-handle"
            aria-label="Arrastar para reordenar"
            {...attributes}
            {...listeners}
          >
            <FaGripVertical size={16} />
          </button>
        )}
        <div className="card">
          {loadingCards[musicLink.id!] ? (
            <p style={{ fontWeight: "bold", color: "#fff" }}>Aguarde..</p>
          ) : (
            <>
              <div className="music-header">
                <span className="span-order">{orderDisplay}ª</span>
                <div
                  className="span-music"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 6px",
                  }}
                >
                  <span className="span-name">{musicLink.name}</span>
                  {musicLink.description?.trim() && (
                    <span>
                      <FaRegCommentDots
                        className="icon-description"
                        onClick={() =>
                          handleCardClick(
                            musicLink.description!,
                            musicLink.name
                          )
                        }
                      />
                    </span>
                  )}
                </div>
                {musicLink.cifra && (
                  <span className="span-cifra">{musicLink.cifra}</span>
                )}

                <motion.button
                  className="btns toggle-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={
                    openMenuId === musicLink.id
                      ? "Ocultar botões"
                      : "Mostrar botões"
                  }
                  onClick={() => toggleButtons(musicLink.id!)}
                >
                  {openMenuId === musicLink.id ? (
                    <FaTimes size={16} />
                  ) : (
                    <FaEllipsisV size={16} />
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {openMenuId === musicLink.id && (
                  <motion.div
                    className="menu-buttons"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {musicLink.link && (
                      <motion.button
                        className="btns youtube-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          openLinkVideo({
                            url: musicLink.link || "",
                          })
                        }
                        title="Assistir vídeo"
                      >
                        <FaYoutube size={16} />
                      </motion.button>
                    )}

                    {musicLink.letter && (
                      <motion.button
                        className="btns letter-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          musicLink.letter &&
                          window.open(musicLink.letter, "_blank")
                        }
                        title="Abrir letra"
                      >
                        <FaFileAlt size={16} />
                      </motion.button>
                    )}

                    {musicLink.spotify && (
                      <motion.button
                        className="btns spotify-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          musicLink.spotify &&
                          window.open(musicLink.spotify, "_blank")
                        }
                        title="Abrir no Spotify"
                      >
                        <FaSpotify size={16} />
                      </motion.button>
                    )}

                    <motion.button
                      className="btns edit-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditClick(musicLink.id!)}
                      title="Editar"
                    >
                      <FaEdit size={16} />
                    </motion.button>

                    {canDeleteMusic && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="btns delete-icon"
                        onClick={() => handleDelete(musicLink.id!)}
                        title="Deletar música"
                      >
                        <FaTrashAlt size={16} />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicLinkList;
