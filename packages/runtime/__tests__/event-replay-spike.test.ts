import { AgentSession, Artifact, Event, Participant, Thread } from '@awp/types';
import { replayProjectEvents } from '../src/event-projection';

describe('event projection', () => {
  it('reconstructs a hiring workflow when events carry canonical snapshots', () => {
    const participant: Participant = {
      id: 'manager-001',
      type: 'human',
      projectId: 'hiring-project-001',
      role: 'reviewer',
      name: 'Hiring Manager',
      joinedAt: '2026-06-24T00:00:00.000Z',
    };

    const thread: Thread = {
      id: 'candidate-thread-001',
      projectId: 'hiring-project-001',
      status: 'active',
      createdAt: '2026-06-24T00:00:00.000Z',
      createdBy: 'recruiter-001',
      participants: ['recruiter-001', 'manager-001', 'agent-001'],
      messages: [],
      metadata: {
        nextActionOwner: 'manager-001',
        nextActionType: 'review-candidate-packet',
      },
    };

    const artifact: Artifact = {
      id: 'candidate-packet-001',
      projectId: 'hiring-project-001',
      type: 'hiring-packet',
      status: 'draft',
      title: 'Candidate Packet',
      content: {
        candidateId: 'candidate-123',
        status: 'waiting-for-human-review',
      },
      createdAt: '2026-06-24T00:00:00.000Z',
      updatedAt: '2026-06-24T00:10:00.000Z',
      createdBy: 'agent-001',
      version: 4,
      metadata: {
        waitingFor: ['manager-001'],
      },
    };

    const session: AgentSession = {
      id: 'session-001',
      projectId: 'hiring-project-001',
      agentId: 'agent-001',
      status: 'idle',
      createdAt: '2026-06-24T00:00:00.000Z',
      updatedAt: '2026-06-24T00:10:00.000Z',
      threads: ['candidate-thread-001'],
      context: {
        waitingFor: ['manager-001'],
        blockedOn: 'human-review',
      },
    };

    const events: Event[] = [
      {
        id: 'event-001',
        name: 'participant.joined',
        timestamp: '2026-06-24T00:00:00.000Z',
        projectId: 'hiring-project-001',
        participantId: 'manager-001',
        payload: { participant },
      },
      {
        id: 'event-002',
        name: 'thread.created',
        timestamp: '2026-06-24T00:00:00.000Z',
        projectId: 'hiring-project-001',
        threadId: 'candidate-thread-001',
        payload: {
          thread,
          record: {
            thread,
            messageCount: 0,
            participants: ['recruiter-001', 'manager-001', 'agent-001'],
          },
        },
      },
      {
        id: 'event-003',
        name: 'artifact.created',
        timestamp: '2026-06-24T00:06:00.000Z',
        projectId: 'hiring-project-001',
        artifactId: 'candidate-packet-001',
        payload: {
          artifact,
          record: {
            artifact,
            versions: [
              {
                id: 'candidate-packet-001-v4',
                artifactId: 'candidate-packet-001',
                version: 4,
                content: artifact.content,
                createdAt: artifact.updatedAt!,
                createdBy: 'agent-001',
              },
            ],
            editors: ['agent-001', 'manager-001'],
            lastModified: artifact.updatedAt!,
          },
        },
      },
      {
        id: 'event-004',
        name: 'run.succeeded',
        timestamp: '2026-06-24T00:08:00.000Z',
        projectId: 'hiring-project-001',
        runId: 'run-001',
        payload: {
          run: {
            id: 'run-001',
            projectId: 'hiring-project-001',
            status: 'succeeded',
            startedAt: '2026-06-24T00:01:00.000Z',
            completedAt: '2026-06-24T00:08:00.000Z',
            targetKind: 'agent',
            targetId: 'research-agent',
            metadata: {
              triggeredBy: 'recruiter-001',
              lastAction: 'Human requested changes',
            },
          },
        },
      },
      {
        id: 'event-005',
        name: 'agent_session.waiting',
        timestamp: '2026-06-24T00:10:00.000Z',
        projectId: 'hiring-project-001',
        agentSessionId: 'session-001',
        payload: { session },
      },
    ];

    const projection = replayProjectEvents(events);

    expect(projection.participants.get('manager-001')).toEqual(participant);
    expect(projection.threads.get('candidate-thread-001')?.thread.participants).toEqual([
      'recruiter-001',
      'manager-001',
      'agent-001',
    ]);
    expect(projection.artifacts.get('candidate-packet-001')?.artifact.content).toEqual({
      candidateId: 'candidate-123',
      status: 'waiting-for-human-review',
    });
    expect(projection.agentSessions.get('session-001')?.context).toEqual({
      waitingFor: ['manager-001'],
      blockedOn: 'human-review',
    });
    expect(projection.runs.get('run-001')?.metadata?.lastAction).toBe('Human requested changes');
  });

  it('shows why thin events are insufficient when events are meant to be canonical', () => {
    const thinEvents: Event[] = [
      {
        id: 'event-001',
        name: 'participant.joined',
        timestamp: '2026-06-24T00:00:00.000Z',
        projectId: 'hiring-project-001',
        participantId: 'manager-001',
        payload: { role: 'reviewer' },
      },
      {
        id: 'event-002',
        name: 'thread.created',
        timestamp: '2026-06-24T00:00:00.000Z',
        projectId: 'hiring-project-001',
        threadId: 'candidate-thread-001',
      },
      {
        id: 'event-003',
        name: 'artifact.created',
        timestamp: '2026-06-24T00:06:00.000Z',
        projectId: 'hiring-project-001',
        artifactId: 'candidate-packet-001',
        payload: { type: 'hiring-packet' },
      },
    ];

    const projection = replayProjectEvents(thinEvents);

    expect(projection.participants.size).toBe(0);
    expect(projection.threads.size).toBe(0);
    expect(projection.artifacts.size).toBe(0);
    expect(projection.runs.size).toBe(0);
    expect(projection.agentSessions.size).toBe(0);
  });
});
