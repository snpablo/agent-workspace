import {
  AgentSession,
  Artifact,
  Event,
  Participant,
  Resource,
  Run,
  Thread,
} from '@awp/types';
import { ArtifactRecord, ProjectState, ThreadRecord } from './types';

export interface ProjectEventProjection {
  resources: Resource[];
  artifacts: Map<string, ArtifactRecord>;
  threads: Map<string, ThreadRecord>;
  runs: Map<string, Run>;
  agentSessions: Map<string, AgentSession>;
  participants: Map<string, Participant>;
}

function cloneRun(run: Run): Run {
  return {
    ...run,
    input: run.input ? { ...run.input } : undefined,
    output: run.output ? { ...run.output } : undefined,
    events: run.events ? [...run.events] : undefined,
    metadata: run.metadata ? { ...run.metadata } : undefined,
  };
}

function cloneParticipant(participant: Participant): Participant {
  return {
    ...participant,
  };
}

function cloneResource(resource: Resource): Resource {
  return {
    ...resource,
    content: resource.content ? { ...resource.content } : undefined,
    metadata: resource.metadata ? { ...resource.metadata } : undefined,
  };
}

function cloneArtifact(artifact: Artifact): Artifact {
  return {
    ...artifact,
    content: { ...artifact.content },
    resources: artifact.resources ? [...artifact.resources] : undefined,
    relatedArtifacts: artifact.relatedArtifacts ? [...artifact.relatedArtifacts] : undefined,
    participants: artifact.participants ? [...artifact.participants] : undefined,
    metadata: artifact.metadata ? { ...artifact.metadata } : undefined,
  };
}

function cloneArtifactRecord(record: ArtifactRecord): ArtifactRecord {
  return {
    ...record,
    artifact: cloneArtifact(record.artifact),
    versions: record.versions.map((version) => ({
      ...version,
      content: { ...version.content },
      metadata: version.metadata ? { ...version.metadata } : undefined,
    })),
    editors: [...record.editors],
    metadata: record.metadata ? { ...record.metadata } : undefined,
  };
}

function buildArtifactRecord(artifact: Artifact): ArtifactRecord {
  const updatedAt = artifact.updatedAt || artifact.createdAt;

  return {
    artifact: cloneArtifact(artifact),
    versions: [
      {
        id: `${artifact.id}-v${artifact.version}`,
        artifactId: artifact.id,
        version: artifact.version,
        content: { ...artifact.content },
        createdAt: updatedAt,
        createdBy: artifact.createdBy,
      },
    ],
    editors: artifact.participants ? [...artifact.participants] : [artifact.createdBy],
    lastModified: updatedAt,
    metadata: artifact.metadata ? { ...artifact.metadata } : undefined,
  };
}

function cloneThread(thread: Thread): Thread {
  return {
    ...thread,
    messages: thread.messages.map((message) => ({
      ...message,
      metadata: message.metadata ? { ...message.metadata } : undefined,
    })),
    participants: thread.participants ? [...thread.participants] : undefined,
    metadata: thread.metadata ? { ...thread.metadata } : undefined,
  };
}

function cloneThreadRecord(record: ThreadRecord): ThreadRecord {
  return {
    ...record,
    thread: cloneThread(record.thread),
    participants: [...record.participants],
    metadata: record.metadata ? { ...record.metadata } : undefined,
  };
}

function buildThreadRecord(thread: Thread): ThreadRecord {
  return {
    thread: cloneThread(thread),
    messageCount: thread.messages.length,
    lastMessageAt:
      thread.messages.length > 0 ? thread.messages[thread.messages.length - 1]?.timestamp : undefined,
    participants: thread.participants ? [...thread.participants] : [],
    metadata: thread.metadata ? { ...thread.metadata } : undefined,
  };
}

function cloneAgentSession(session: AgentSession): AgentSession {
  return {
    ...session,
    runs: session.runs ? [...session.runs] : undefined,
    threads: session.threads ? [...session.threads] : undefined,
    context: session.context ? { ...session.context } : undefined,
    metadata: session.metadata ? { ...session.metadata } : undefined,
  };
}

function appendUniqueResource(resources: Resource[], resource: Resource): Resource[] {
  const next = resources.filter((entry) => entry.id !== resource.id);
  next.push(cloneResource(resource));
  return next;
}

export function createEmptyProjection(): ProjectEventProjection {
  return {
    resources: [],
    artifacts: new Map(),
    threads: new Map(),
    runs: new Map(),
    agentSessions: new Map(),
    participants: new Map(),
  };
}

export function applyEventToProjection(
  projection: ProjectEventProjection,
  event: Event,
): ProjectEventProjection {
  switch (event.name) {
    case 'run.started':
    case 'run.succeeded':
    case 'run.failed': {
      const run = event.payload?.run as Run | undefined;
      if (run) {
        projection.runs.set(run.id, cloneRun(run));
      }
      break;
    }

    case 'artifact.created':
    case 'artifact.updated': {
      const record = event.payload?.record as ArtifactRecord | undefined;
      const artifact = event.payload?.artifact as Artifact | undefined;
      if (record) {
        projection.artifacts.set(record.artifact.id, cloneArtifactRecord(record));
      } else if (artifact) {
        projection.artifacts.set(artifact.id, buildArtifactRecord(artifact));
      }
      break;
    }

    case 'thread.created':
    case 'thread.updated': {
      const record = event.payload?.record as ThreadRecord | undefined;
      const thread = event.payload?.thread as Thread | undefined;
      if (record) {
        projection.threads.set(record.thread.id, cloneThreadRecord(record));
      } else if (thread) {
        projection.threads.set(thread.id, buildThreadRecord(thread));
      }
      break;
    }

    case 'participant.joined':
    case 'participant.updated': {
      const participant = event.payload?.participant as Participant | undefined;
      if (participant) {
        projection.participants.set(participant.id, cloneParticipant(participant));
      }
      break;
    }

    case 'resource.added':
    case 'resource.updated': {
      const resource = event.payload?.resource as Resource | undefined;
      if (resource) {
        projection.resources = appendUniqueResource(projection.resources, resource);
      }
      break;
    }

    case 'agent_session.waiting':
    case 'agent_session.resumed':
    case 'agent_session.updated': {
      const session = event.payload?.session as AgentSession | undefined;
      if (session) {
        projection.agentSessions.set(session.id, cloneAgentSession(session));
      }
      break;
    }
  }

  return projection;
}

export function replayProjectEvents(events: Event[]): ProjectEventProjection {
  const projection = createEmptyProjection();

  for (const event of events) {
    applyEventToProjection(projection, event);
  }

  return projection;
}

export function applyEventToProjectState(context: ProjectState, event: Event): void {
  const projection = {
    resources: context.resources,
    artifacts: context.artifacts,
    threads: context.threads,
    runs: context.runs,
    agentSessions: context.agentSessions,
    participants: context.participants,
  };

  applyEventToProjection(projection, event);

  context.resources = projection.resources;
}
