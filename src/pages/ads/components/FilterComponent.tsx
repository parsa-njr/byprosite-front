import React, { useState, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  ListFilter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetGroups, useGetItems } from "@/query/globals/useGlobal";
import { Button } from "@/components/ui/button";

interface FilterProps {
  initialCategories: any[];
  firstSelectedCat: string;
  firstFilterType: string;
  onChange?: (selectedData: {
    categories: string[];
    groups: string[];
    items: string[];
    filterType?: "buy" | "sell" | "";
  }) => void;
}

const FilterComponent: React.FC<FilterProps> = ({
  initialCategories,
  firstSelectedCat,
  firstFilterType,
  onChange,
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const [expanded, setExpanded] = useState<{
    categories: { [key: string]: boolean };
    groups: { [key: string]: boolean };
  }>({ categories: {}, groups: {} });
  const [selected, setSelected] = useState<{
    categories: { [key: string]: boolean };
    groups: { [key: string]: boolean };
    items: { [key: string]: boolean };
  }>({ categories: {}, groups: {}, items: {} });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"buy" | "sell" | "">("");

  const { data: groupData } = useGetGroups(selectedCat);
  const { data: itemData } = useGetItems(selectedCat, selectedGroup);

  useEffect(() => {
    if (!firstSelectedCat && !firstFilterType) return;

    // ✅ set filter type separately
    if (firstFilterType) setFilterType(firstFilterType as "buy" | "sell" | "");

    // ✅ handle initial category selection
    if (firstSelectedCat) {
      const categoriesArray = Array.isArray(firstSelectedCat)
        ? firstSelectedCat
        : [firstSelectedCat];

      setSelected((prev) => {
        const updated = {
          ...prev,
          categories: { ...prev.categories },
          groups: { ...prev.groups },
          items: { ...prev.items },
        };

        categoriesArray.forEach((catId) => {
          updated.categories[catId] = true;
        });

        return updated;
      });
    }
  }, [firstSelectedCat, firstFilterType]);

  const toggleExpand = useCallback(
    (level: "category" | "group", id: string) => {
      setExpanded((prev) => ({
        ...prev,
        [level === "category" ? "categories" : "groups"]: {
          ...prev[level === "category" ? "categories" : "groups"],
          [id]: !prev[level === "category" ? "categories" : "groups"][id],
        },
      }));
      if (level === "category") setSelectedCat(id);
      if (level === "group") setSelectedGroup(id);
    },
    []
  );

  const handleToggle = useCallback(
    (
      level: "category" | "group" | "item",
      catId: string,
      groupId?: string,
      itemId?: string
    ) => {
      setSelected((prev) => {
        const newSelected = {
          categories: { ...prev.categories },
          groups: { ...prev.groups },
          items: { ...prev.items },
        };

        if (level === "category") {
          const newState = !prev.categories[catId];
          newSelected.categories[catId] = newState;
          const catGroups =
            categories.find((c) => c.id === catId)?.groups || [];
          catGroups.forEach((g) => {
            newSelected.groups[g.id] = newState;
            g.items?.forEach((i) => (newSelected.items[i.id] = newState));
          });
        }

        if (level === "group" && groupId) {
          const newState = !prev.groups[groupId];
          newSelected.groups[groupId] = newState;
          const group = categories
            .find((c) => c.id === catId)
            ?.groups?.find((g) => g.id === groupId);
          group?.items?.forEach((i) => (newSelected.items[i.id] = newState));
          const catGroups =
            categories.find((c) => c.id === catId)?.groups || [];
          newSelected.categories[catId] = catGroups.every(
            (g) => newSelected.groups[g.id]
          );
        }

        if (level === "item" && groupId && itemId) {
          const newState = !prev.items[itemId];
          newSelected.items[itemId] = newState;
          const groupItems =
            categories
              .find((c) => c.id === catId)
              ?.groups?.find((g) => g.id === groupId)?.items || [];
          newSelected.groups[groupId] = groupItems.every(
            (i) => newSelected.items[i.id]
          );
          const catGroups =
            categories.find((c) => c.id === catId)?.groups || [];
          newSelected.categories[catId] = catGroups.every(
            (g) => newSelected.groups[g.id]
          );
        }

        return newSelected;
      });
    },
    [categories]
  );

  useEffect(() => {
    if (!groupData || !selectedCat) return;
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== selectedCat) return cat;
        const isCatSelected = !!selected.categories[selectedCat];
        const newGroups = groupData.data.data.map((g: any) => {
          const isGroupSelected = !!selected.groups[g.id] || isCatSelected;
          const newItems = (g.items || []).map((i: any) => ({
            ...i,
            _selected:
              !!selected.items[i.id] || isGroupSelected || isCatSelected,
          }));
          return { ...g, items: newItems, _selected: isGroupSelected };
        });
        return { ...cat, groups: newGroups };
      })
    );
    setLoading((prev) => ({ ...prev, [selectedCat]: false }));
  }, [groupData, selectedCat, selected]);

  useEffect(() => {
    if (!itemData || !selectedGroup) return;
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        groups: cat.groups?.map((g) => {
          if (g.id !== selectedGroup) return g;
          const isGroupSelected = !!selected.groups[selectedGroup];
          const parentCat = prev.find((c) =>
            c.groups?.some((gg) => gg.id === selectedGroup)
          );
          const isCatSelected = parentCat
            ? !!selected.categories[parentCat.id]
            : false;
          const newItems = itemData.data.data.map((i: any) => ({
            ...i,
            _selected:
              !!selected.items[i.id] || isGroupSelected || isCatSelected,
          }));
          return {
            ...g,
            items: newItems,
            _selected: isGroupSelected || isCatSelected,
          };
        }),
      }))
    );
    setLoading((prev) => ({ ...prev, [selectedGroup]: false }));
  }, [itemData, selectedGroup, selected]);

  useEffect(() => {
    if (!onChange) return;
    const selectedData = {
      categories: Object.entries(selected.categories)
        .filter(([_, v]) => v)
        .map(([k]) => k),
      groups: Object.entries(selected.groups)
        .filter(([_, v]) => v)
        .map(([k]) => k),
      items: Object.entries(selected.items)
        .filter(([_, v]) => v)
        .map(([k]) => k),
      filterType,
    };
    setTimeout(() => onChange(selectedData), 0);
  }, [selected, filterType]);

  return (
    <ScrollArea className="h-[80vh] rounded-3xl border border-gray-100 p-6 bg-white shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-right pr-2 text-gray-800">
        فیلترها
      </h3>

      {/* 🔁 Buy / Sell Toggle */}
      <div className="flex justify-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          {/* دکمه همه */}
          <Button
            variant="ghost"
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
        ${
          !filterType
            ? "bg-gray-900 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
            onClick={() => setFilterType("")} // مقدار type خالی می‌شود
          >
            همه
          </Button>

          {/* دکمه خرید */}
          <Button
            variant="ghost"
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
        ${
          filterType === "buy"
            ? "bg-gray-900 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
            onClick={() => setFilterType("buy")}
          >
            خرید
          </Button>

          {/* دکمه فروش */}
          <Button
            variant="ghost"
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
        ${
          filterType === "sell"
            ? "bg-gray-900 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
            onClick={() => setFilterType("sell")}
          >
            فروش
          </Button>
        </div>
      </div>

      {/* Main Filter Tree */}
      <div style={{ direction: "rtl" }} className="space-y-4">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-300"
          >
            {/* Category */}
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-2xl hover:bg-gray-100 transition-colors">
              <div
                className="flex items-center gap-3"
                onClick={() => toggleExpand("category", cat.id)}
              >
                {expanded.categories[cat.id] ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )}
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <SlidersHorizontal size={14} />
                </div>
                <Label className="font-semibold text-gray-800 text-base">
                  {cat.title}
                </Label>
              </div>
              <Checkbox
                checked={cat._selected ?? !!selected.categories[cat.id]}
                onCheckedChange={() => handleToggle("category", cat.id)}
              />
            </div>

            {/* Groups */}
            <AnimatePresence>
              {expanded.categories[cat.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pr-5 pb-4 mt-1 space-y-3 border-r-2 border-blue-100"
                >
                  {loading[cat.id] ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-gray-400" />
                    </div>
                  ) : (
                    cat.groups?.map((group) => (
                      <motion.div
                        key={group.id}
                        layout
                        className="rounded-xl bg-gradient-to-br from-blue-50/50 to-white border border-gray-100 p-3 hover:shadow transition-all"
                      >
                        <div className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg hover:bg-blue-50/60 transition-colors">
                          <div
                            className="flex items-center gap-3"
                            onClick={() => toggleExpand("group", group.id)}
                          >
                            {expanded.groups[group.id] ? (
                              <ChevronDown
                                size={14}
                                className="text-gray-500"
                              />
                            ) : (
                              <ChevronRight
                                size={14}
                                className="text-gray-500"
                              />
                            )}
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-200/50 text-blue-600">
                              <ListFilter size={12} />
                            </div>
                            <Label className="text-sm font-medium text-gray-700">
                              {group.title}
                            </Label>
                          </div>
                          <Checkbox
                            checked={
                              group._selected ?? !!selected.groups[group.id]
                            }
                            onCheckedChange={() =>
                              handleToggle("group", cat.id, group.id)
                            }
                          />
                        </div>

                        {/* Items */}
                        <AnimatePresence>
                          {expanded.groups[group.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="pr-7 mt-2 space-y-2 border-r border-dotted border-blue-100"
                            >
                              {loading[group.id] ? (
                                <div className="flex justify-center py-2">
                                  <Loader2 className="animate-spin text-gray-400" />
                                </div>
                              ) : (
                                group.items?.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-blue-50/40 transition-colors"
                                  >
                                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                      {item.title}
                                    </Label>
                                    <Checkbox
                                      checked={
                                        item._selected ??
                                        !!selected.items[item.id]
                                      }
                                      onCheckedChange={() =>
                                        handleToggle(
                                          "item",
                                          cat.id,
                                          group.id,
                                          item.id
                                        )
                                      }
                                    />
                                  </div>
                                ))
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FilterComponent;
