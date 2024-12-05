import { useState } from "react";

import styles from "./DragAssignments.module.css";
import { classNames } from "../utils/classNames";

type AssignmentTarget<Target, Source> = {
  id: string;
  name: string;
  original: Target;
  assignments: Record<string, Assignable<Source>[]>;
}

type Assignable<Source> = {
  id: string;
  name: string;
  original: Source;
}

type AssignmentTypeConfig<Target, Source> = {
  name: string;
  addText: string;
  id: string;
  checkCanAssign: (target: AssignmentTarget<Target, Source>, option: Assignable<Source>) => boolean;
  checkAvailable: (target: AssignmentTarget<Target, Source>) => boolean;
};


type DragAssignmentProps<Target, Source> = {
  assignmentTypeConfig: AssignmentTypeConfig<Target, Source>[];
  value: AssignmentTarget<Target, Source>[];
  options: Assignable<Source>;
  onChange: (value: AssignmentTarget<Target, Source>[]) => [];
  targetListTitle: string;
  assignableListTitle: string;
}

export const DragAssignment = <Target, Source>(props: DragAssignmentProps<Target, Source>) => {
  const { targetListTitle, assignableListTitle, value, onChange, assignmentTypeConfig } = props;
  const [draggedOverTargetId, setDraggedOverTargetId] = useState<string | null>(null);
  const [draggedOverAssignmentType, setDraggedOverAssignmentType] = useState<string | null>(null);

  const handleTargetDragLeave = (idToUnset: string) => {
    setDraggedOverTargetId((prevId) => {
      if (idToUnset !== prevId) return prevId;
      setDraggedOverAssignmentType(null);
      return null;
    });
  }

  const handleClickRemove = (targetId: string, assignmentType: string, assignmentId: string) => {
    const targetIndex = value.findIndex((target) => target.id === targetId);
    const target = value[targetIndex];

    const newAssignments = {
      ...target.assignments,
      [assignmentType]: target.assignments[assignmentType].filter((assignment) => assignment.id !== assignmentId),
    };

    const newValue = [...value];
    newValue[targetIndex] = {
      ...target,
      assignments: newAssignments,
    };

    onChange(newValue);
  }

  const renderAssigned = (targetId: string, assignmentType: string, assignable: Assignable<Source>) => {
    return (
      <div 
        key={assignable.id}
        className={classNames(styles.card, styles.assignable)}
      >
        <div className={styles.name}>{assignable.name}</div>
        <button className={styles.deleteButton} onClick={() => handleClickRemove(targetId, assignmentType, assignable.id)}>x</button>
      </div>
    )
  }

  const renderAssignmentType = (target: AssignmentTarget<Target, Source>, assignmentTypeConfig: AssignmentTypeConfig<Target, Source>) => {
    const assigned = target.assignments[assignmentTypeConfig.id]
    const { checkAvailable, id, name, addText } = assignmentTypeConfig;

    if (!checkAvailable(target)) return null;

    const isTargetDraggedOver = draggedOverTargetId === target.id;
    const isDraggedOver = isTargetDraggedOver && draggedOverAssignmentType === id;

    return (
      <div className={classNames(styles.card, styles.assignmentType)} key={id}>
        <div className={styles.title}>{name}</div>
        <div className={styles.listContent}>
          {assigned.map((assigned) => renderAssigned(target.id, id, assigned))}
          {isTargetDraggedOver && (
            <div 
              onDragEnter={() => setDraggedOverAssignmentType(id)}
              onDragLeave={() => 
                setDraggedOverAssignmentType(
                  (prevType) => prevType === id ? null : prevType
                )
              }
              className={classNames(
                styles.card,
                styles.addAssignment,
                { [styles.highlighted]: isDraggedOver }
              )}
            >
              {addText}
            </div>
          )}
        </div>
      </div>
    )
  }


  return (
    <div className={styles.root}>
      <div className={styles.list}>
        <div className={styles.listTitle}>{targetListTitle}</div>
        <div className={styles.listContent}>
          {value.map((target) => (
            <div 
              className={classNames(styles.card, styles.target)}
              key={target.id}
              onDragLeave={() => handleTargetDragLeave(target.id)}
              onDragEnter={() => setDraggedOverTargetId(target.id)}
            >
              <div className={classNames(styles.title)}>
                {target.name}
              </div>
              {assignmentTypeConfig.map((config) => renderAssignmentType(target, config))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.listTitle}>{assignableListTitle}</div>
        <div className={styles.listContent}>

        </div>
      </div>
    </div>
  )
}